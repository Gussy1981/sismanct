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

// ── Visibility logic ──────────────────────────────────────────────────────────

/**
 * Should this task be shown to the operator today?
 * Rules:
 *  - Task must be activated (fechaConsulta !== null)
 *  - Never show on weekends
 *  - Diaria:    show every workday it has not been done today
 *  - Semanal:   show every workday until done once this ISO week
 *  - Quincenal: show every workday until done once this quincena
 *  - Mensual:   show every workday until done once this month
 */
const debeMostrarseHoy = (task, hoy) => {
  if (!task.fechaConsulta) return false;
  if (!esDiaHabil(hoy))    return false;

  const ultima = task.ultimaEjecucion
    ? DateTime.fromJSDate(task.ultimaEjecucion).setZone(ARGENTINA_ZONE).startOf("day")
    : null;

  switch (task.frecuencia) {
    case "Diaria":
      return !ultima || !hoy.hasSame(ultima, "day");
    case "Semanal":
      return !ultima || !mismaSemanaISO(hoy, ultima);
    case "Quincenal":
      return !ultima || !mismaQuincena(hoy, ultima);
    case "Mensual":
      return !ultima || !mismoMes(hoy, ultima);
    default:
      return false;
  }
};

// ── TaskNotDone dedup ─────────────────────────────────────────────────────────

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

// ── Missed-period detection ───────────────────────────────────────────────────

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
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

const save = async (req, res, next) => {
  try {
    const { equipo, tarea, encargado, frecuencia } = req.body;
    const tareatodo = new TaskToDo({ equipo, tarea, encargado, frecuencia });
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

/** All tasks (admin view) — filtered to those visible today */
const listAll = async (req, res, next) => {
  try {
    const tasks  = await TaskToDo.find({});
    const hoy    = DateTime.now().setZone(ARGENTINA_ZONE).startOf("day");
    const visibles = tasks.filter((t) => debeMostrarseHoy(t, hoy));
    res.status(200).json({ status: "Success", tasks: visibles });
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
 * For Diaria tasks, blocks completion until all unresolved TaskNotDone
 * records are justified (motivoEstado: true).
 */
const cumplirTarea = async (req, res, next) => {
  const Id = req.params.id;
  const { tiempo, encargado, ejecutante, comentarios } = req.body;

  try {
    const task = await TaskToDo.findById(Id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (task.frecuencia === "Diaria") {
      const pendientes = await TaskNotDone.countDocuments({ task: Id, motivoEstado: false });
      if (pendientes > 0) {
        return res.status(403).json({
          status: "Error",
          message: "Debe justificar las tareas no cumplidas antes de continuar",
        });
      }
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

const update = async (req, res, next) => {
  try {
    const tarea = await TaskToDo.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({ status: "Success", message: "Registro modificado correctamente", tarea });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle task activation: null → today (admin activates), date → null (deactivates).
 * Resetting ultimaEjecucion and estado on deactivation ensures clean state on re-activation.
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
      tarea.fechaConsulta = DateTime.now().setZone(ARGENTINA_ZONE).toJSDate();
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
