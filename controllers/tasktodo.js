const TaskDone    = require("../models/taskdone");
const TaskNotDone = require("../models/taskNotDone");
const TaskToDo    = require("../models/tasktodo");
const { DateTime } = require("luxon");
const ARGENTINA_ZONE = "America/Argentina/Buenos_Aires";

// ── Calendar helpers ──────────────────────────────────────────────────────────

/** Mon=1 … Fri=5; Sat=6, Sun=7 */
const esDiaHabil = (dt) => dt.weekday >= 1 && dt.weekday <= 5;

/** The most recent workday before dt (skips weekends) */
const anteriorDiaHabil = (dt) => {
  let d = dt.minus({ days: 1 });
  while (!esDiaHabil(d)) d = d.minus({ days: 1 });
  return d;
};

/** First workday (Mon–Fri) of the month containing dt */
const primerDiaHabilDelMes = (dt) => {
  let d = dt.startOf("month");
  while (!esDiaHabil(d)) d = d.plus({ days: 1 });
  return d;
};

/** True when both DateTime values fall within the same ISO week */
const mismaSemanaISO = (a, b) =>
  a.weekYear === b.weekYear && a.weekNumber === b.weekNumber;

/** True when both fall in the same quincena (1–15 = Q1, 16+ = Q2) */
const mismaQuincena = (a, b) => {
  if (a.year !== b.year || a.month !== b.month) return false;
  return (a.day <= 15) === (b.day <= 15);
};

/** True when both fall in the same calendar month */
const mismoMes = (a, b) => a.year === b.year && a.month === b.month;

// ── Anchored frequencies (Trimestral / Semestral / Anual) ─────────────────────

/** Interval in months for the calendar-anchored frequencies */
const INTERVALO_MESES = { Trimestral: 3, Semestral: 6, Anual: 12 };

/** True when the frequency is anchored to a calendar month (needs mesAncla) */
const esFrecuenciaAnclada = (frecuencia) => Boolean(INTERVALO_MESES[frecuencia]);

/**
 * Start (first day, 00:00) of the anchored period that contains `hoy`.
 *
 * A period boundary falls on every month `m` where
 *   (m - mesAncla) mod intervalo === 0
 * e.g. Semestral with mesAncla = March → boundaries in March and September.
 */
const inicioPeriodoAnclado = (hoy, intervalo, mesAncla) => {
  const ancla = (((Number(mesAncla) || 1) - 1) % 12 + 12) % 12; // 0-based month
  const totalMes = hoy.year * 12 + (hoy.month - 1);
  const offset = ((totalMes - ancla) % intervalo + intervalo) % intervalo;
  const inicioTotal = totalMes - offset;
  return DateTime.fromObject(
    {
      year: Math.floor(inicioTotal / 12),
      month: (inicioTotal % 12) + 1,
      day: 1,
    },
    { zone: ARGENTINA_ZONE }
  ).startOf("day");
};

// ── Period status ────────────────────────────────────────────────────────────

/**
 * Has the task already been completed within its current period?
 * Pure period math — ignores weekends and activation, so it can drive both the
 * operator's "show today" view and the admin dashboard counters.
 */
const estaAlDia = (task, hoy) => {
  if (!task.ultimaEjecucion) return false;

  const ultima = DateTime.fromJSDate(task.ultimaEjecucion)
    .setZone(ARGENTINA_ZONE)
    .startOf("day");

  switch (task.frecuencia) {
    case "Diaria":
      return hoy.hasSame(ultima, "day");
    case "Semanal":
      return mismaSemanaISO(hoy, ultima);
    case "Quincenal":
      return mismaQuincena(hoy, ultima);
    case "Mensual":
      return mismoMes(hoy, ultima);
    case "Trimestral":
    case "Semestral":
    case "Anual": {
      const intervalo = INTERVALO_MESES[task.frecuencia];
      const inicio = inicioPeriodoAnclado(hoy, intervalo, task.mesAncla);
      return ultima >= inicio;
    }
    default:
      return false;
  }
};

// ── Visibility logic ─────────────────────────────────────────────────────────

/**
 * Should this task be shown to the operator today?
 *  - Task must be activated (fechaConsulta !== null)
 *  - Never show on weekends
 *  - Otherwise: show every workday until it has been done in its current period
 *    (day / ISO week / quincena / calendar month / anchored quarter-half-year)
 */
const debeMostrarseHoy = (task, hoy) => {
  if (!task.fechaConsulta) return false;
  if (!esDiaHabil(hoy))    return false;
  return !estaAlDia(task, hoy);
};

// ── TaskNotDone dedup ────────────────────────────────────────────────────────

const crearTaskNotDoneSiNoExiste = async (taskId, encargado, fechaDone) => {
  const fecha = DateTime.isDateTime(fechaDone) ? fechaDone.toISODate() : fechaDone;
  const existe = await TaskNotDone.findOne({ task: taskId, fechaDone: fecha });
  if (!existe) {
    await new TaskNotDone({
      task: taskId,
      fechaDone: fecha,
      encargado,
      motivo: "Pendiente de justificación",
      motivoEstado: false,
    }).save();
  }
};

// ── Missed-period detection ──────────────────────────────────────────────────

/**
 * Called when a task IS shown today.
 * Looks at the immediately preceding period and creates a TaskNotDone if it
 * was missed (task was active then but not completed).
 */
const detectarMisadas = async (task, hoy) => {
  if (!task.fechaConsulta) return;

  const activacion = DateTime.fromJSDate(task.fechaConsulta).setZone(ARGENTINA_ZONE).startOf("day");
  const ultima = task.ultimaEjecucion
    ? DateTime.fromJSDate(task.ultimaEjecucion).setZone(ARGENTINA_ZONE).startOf("day")
    : null;

  switch (task.frecuencia) {
    case "Diaria": {
      const prevWorkday = anteriorDiaHabil(hoy);
      // Task must have been active on prevWorkday
      if (activacion > prevWorkday) break;
      // If done on prevWorkday → no miss
      if (ultima && prevWorkday.hasSame(ultima, "day")) break;
      await crearTaskNotDoneSiNoExiste(task._id, task.encargado, prevWorkday);
      break;
    }

    case "Semanal": {
      const lunesActual   = hoy.startOf("week");
      const lunesPasado   = lunesActual.minus({ weeks: 1 });
      // No previous period if activated this week
      if (activacion >= lunesActual) break;
      // Done in the previous week?
      if (ultima && ultima >= lunesPasado && ultima < lunesActual) break;
      await crearTaskNotDoneSiNoExiste(task._id, task.encargado, lunesPasado);
      break;
    }

    case "Quincenal": {
      // Boundaries of the current quincena
      const inicioQ = hoy.day <= 15
        ? hoy.startOf("month")
        : hoy.startOf("month").plus({ days: 15 });
      // Boundaries of the previous quincena
      const inicioQAnterior = hoy.day <= 15
        ? hoy.minus({ months: 1 }).startOf("month").plus({ days: 15 })
        : hoy.startOf("month");
      // No previous period if activated this quincena
      if (activacion >= inicioQ) break;
      // Done in previous quincena?
      if (ultima && ultima >= inicioQAnterior && ultima < inicioQ) break;
      await crearTaskNotDoneSiNoExiste(task._id, task.encargado, inicioQAnterior);
      break;
    }

    case "Mensual": {
      const inicioMes      = hoy.startOf("month");
      const inicioMesPasado = inicioMes.minus({ months: 1 });
      // No previous period if activated this month
      if (activacion >= inicioMes) break;
      // Done last month?
      if (ultima && ultima >= inicioMesPasado && ultima < inicioMes) break;
      await crearTaskNotDoneSiNoExiste(
        task._id,
        task.encargado,
        primerDiaHabilDelMes(inicioMesPasado)
      );
      break;
    }

    case "Trimestral":
    case "Semestral":
    case "Anual": {
      const intervalo      = INTERVALO_MESES[task.frecuencia];
      const inicioActual   = inicioPeriodoAnclado(hoy, intervalo, task.mesAncla);
      const inicioPrevio   = inicioActual.minus({ months: intervalo });
      // No previous period if activated during the current one
      if (activacion >= inicioActual) break;
      // Done during the previous period?
      if (ultima && ultima >= inicioPrevio && ultima < inicioActual) break;
      await crearTaskNotDoneSiNoExiste(
        task._id,
        task.encargado,
        primerDiaHabilDelMes(inicioPrevio)
      );
      break;
    }
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

const save = async (req, res, next) => {
  try {
    const { equipo, tarea, encargado, frecuencia, mesAncla } = req.body;
    const tareatodo = new TaskToDo({
      equipo,
      tarea,
      encargado,
      frecuencia,
      mesAncla: esFrecuenciaAnclada(frecuencia) ? Number(mesAncla) || null : null,
    });
    const documento = await tareatodo.save();
    res.status(201).json({ status: "Success", message: "Registro Guardado", documento });
  } catch (error) {
    next(error);
  }
};

const deleteTaskToDo = async (req, res, next) => {
  try {
    await TaskToDo.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: "Success", message: "Registro Eliminado" });
  } catch (error) {
    next(error);
  }
};

/** Tasks for the logged-in operator — only those visible today */
const listbyuser = async (req, res, next) => {
  try {
    const encargado = req.user.id;
    const tasks  = await TaskToDo.find({ encargado });
    const hoy    = DateTime.now().setZone(ARGENTINA_ZONE).startOf("day");
    const visibles = tasks.filter((t) => debeMostrarseHoy(t, hoy));
    res.status(200).json({ status: "Success", tasks: visibles });
  } catch (error) {
    next(error);
  }
};

/**
 * Dashboard view — every activated task with its current-period status,
 * so the front end can show meaningful "al día / pendientes" counters.
 */
const listAll = async (req, res, next) => {
  try {
    const tasks  = await TaskToDo.find({ fechaConsulta: { $ne: null } });
    const hoy    = DateTime.now().setZone(ARGENTINA_ZONE).startOf("day");
    const conEstado = tasks.map((t) => ({
      ...t.toObject(),
      alDia: estaAlDia(t, hoy),
      venceHoy: debeMostrarseHoy(t, hoy),
    }));
    res.status(200).json({ status: "Success", tasks: conEstado });
  } catch (error) {
    next(error);
  }
};

/** Tasks for a specific equipment — detects and records missed periods */
const listbyequipo = async (req, res, next) => {
  try {
    const tasks  = await TaskToDo.find({ equipo: req.params.id });
    const hoy    = DateTime.now().setZone(ARGENTINA_ZONE).startOf("day");
    const visibles = [];

    for (const task of tasks) {
      if (!debeMostrarseHoy(task, hoy)) continue;
      await detectarMisadas(task, hoy);
      visibles.push(task);
    }

    res.status(200).json({ status: "Success", tasks: visibles });
  } catch (error) {
    next(error);
  }
};

const listbytarea = async (_req, res, next) => {
  try {
    const tareas = await TaskToDo.find({});
    res.status(200).json({ status: "Success", tareas });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a task as completed.
 * Blocks completion — for any frequency — while the task still has
 * unresolved TaskNotDone records (motivoEstado: false) to justify.
 */
const cumplirTarea = async (req, res, next) => {
  const Id = req.params.id;
  const { tiempo, encargado, ejecutante, comentarios } = req.body;

  try {
    const task = await TaskToDo.findById(Id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    const pendientes = await TaskNotDone.countDocuments({ task: Id, motivoEstado: false });
    if (pendientes > 0) {
      return res.status(403).json({
        status: "Error",
        message: "Debe justificar las tareas no cumplidas antes de continuar",
      });
    }

    const hoy = DateTime.now().setZone(ARGENTINA_ZONE);
    await new TaskDone({
      task: Id,
      fechaDone: hoy.toISODate(),
      tiempo,
      encargado,
      ejecutante,
      comentarios,
    }).save();

    task.ultimaEjecucion = hoy.toJSDate();
    task.estado = true;
    await task.save();

    res.status(200).json({ status: "Success", message: "Tarea realizada exitosamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Edit a task. Whitelisted fields only — never touches fechaConsulta /
 * ultimaEjecucion / estado, and clears mesAncla when the frequency is no
 * longer a calendar-anchored one.
 */
const update = async (req, res, next) => {
  try {
    const { equipo, tarea, encargado, frecuencia, mesAncla } = req.body;
    const campos = { equipo, tarea, encargado, frecuencia };
    campos.mesAncla = esFrecuenciaAnclada(frecuencia) ? Number(mesAncla) || null : null;

    const tareaMod = await TaskToDo.updateOne({ _id: req.params.id }, { $set: campos });
    res.status(200).json({ status: "Success", message: "Registro modificado correctamente", tarea: tareaMod });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle task activation: null → today (admin activates), date → null (deactivates).
 * Resetting ultimaEjecucion and estado on deactivation ensures clean state on re-activation.
 * On activation, an anchored task without mesAncla inherits the current month.
 */
const updateFechaConsulta = async (req, res, next) => {
  try {
    const tarea = await TaskToDo.findById(req.params.id);
    if (!tarea) return res.status(404).json({ status: "Error", message: "No se encontró la tarea" });

    if (tarea.fechaConsulta) {
      tarea.fechaConsulta  = null;
      tarea.ultimaEjecucion = null;
      tarea.estado         = false;
    } else {
      const ahora = DateTime.now().setZone(ARGENTINA_ZONE);
      tarea.fechaConsulta = ahora.toJSDate();
      if (esFrecuenciaAnclada(tarea.frecuencia) && !tarea.mesAncla) {
        tarea.mesAncla = ahora.month;
      }
    }

    await tarea.save();
    res.status(200).json({ status: "Success", message: "Fecha de consulta actualizada", tarea });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  save,
  deleteTaskToDo,
  listbyuser,
  listAll,
  listbyequipo,
  listbytarea,
  cumplirTarea,
  update,
  updateFechaConsulta,
};
