const TaskDone = require("../models/taskdone");
const TaskNotDone = require("../models/taskNotDone");
const TaskToDo = require("../models/tasktodo");
const { DateTime } = require("luxon");

//Metodo para guardar registros
const save = async (req, res, next) => {
  try {
    const params = req.body;
    console.log(params);
    let tareatodo = new TaskToDo({
      equipo: params.equipo,
      tarea: params.tarea,
      encargado: params.encargado,
      frecuencia: params.frecuencia,
      ultimaEjecucion: params.ultimaEjecucion,
      diasFrecuencia: params.diasFrecuencia,
    });
    console.log(tareatodo);
    let documento = await tareatodo.save();
    res.send({
      status: "Succes",
      message: "Registro Guardado",
      documento,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al crear registro",
      error,
    });
    next(error);
  }
};

//Metodo para eliminar registros
const deleteTaskToDo = async (req, res, next) => {
  try {
    let tareatodo = await TaskToDo.deleteOne({ _id: req.params.id });
    return res.status(200).send({
      status: "Succes",
      message: "Registro Eliminado",
      tareatodo,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al eliminar registro",
      error,
    });
    next(error);
  }
};

//Metodo para listar las tareas de un usuario especifico (registrado)
const listbyuser = async (req, res) => {
  try {
    const encargado = req.user.id;
    const tasks = await TaskToDo.find({ encargado });
    const tasksToReturn = [];

    for (const task of tasks) {
      if (task.debeEjecutarseHoy()) {
        tasksToReturn.push(task);
      }
    }
    res.status(200).json({ tasks: tasksToReturn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Metodo para listar todas las tareas
const listAll = async (req, res, next) => {
  try {
    let tareas = await TaskToDo.find({ fechaConsulta: { $ne: null }});
    const tasksToReturn = [];

    for (const tarea of tareas) {

      if (tarea.ultimaEjecucion ) {
        const hoy = DateTime.local().startOf('day'); //genero una variable con la fecha de hoy
        const ultimaEjecucion = DateTime.fromJSDate(tarea.ultimaEjecucion); //genero una variable y asigno la fecha del obtjeto
        const frecuencia = tarea.frecuencia; //genero una variable y asigno la frecuencia del objeto
        //genero una variable y le asigno un valor numerico dependiendo del valor de frecuencia, para mensual utilizo el metodo de luxon para calcular los dias del mes
        const diasFrecuencia = {
          Diaria: 1,
          Semanal: 7,
          Quincenal: 14,
          Mensual: hoy.daysInMonth,
        }[frecuencia];
        //genero una nueva variable a la que le asigno como valor, la diferencia en dias de ultimaEjecucion versus la variable hoy
        const diasDesdeUltimaEjecucion = hoy.diff(ultimaEjecucion, "days").days;

        // Si la tarea debe ejecutarse hoy y su última ejecución fue antes de hoy, cambiamos el estado a false
        if (diasDesdeUltimaEjecucion >= diasFrecuencia) {
          tarea.estado = false;
          console.log(tarea.estado);
          await tarea.save();
          tasksToReturn.push(tarea);
        } else {
          tasksToReturn.push(tarea);
        }
      } else if (!tarea.ultimaEjecucion && tarea.fechaConsulta) {
        const hoy = DateTime.local().startOf('day');
        const fechaConsulta = DateTime.fromJSDate(tarea.fechaConsulta);
        const frecuencia = tarea.frecuencia;
        const diasFrecuencia = {
          Diaria: 1,
          Semanal: 7,
          Quincenal: 14,
          Mensual: hoy.daysInMonth,
        }[frecuencia];
        const diasDesdefechaConsulta = hoy.diff(fechaConsulta, "days").days;
        if (diasDesdefechaConsulta >= diasFrecuencia) {
            const taskNotDone = new TaskNotDone({
            task: tarea._id,
            fechaDone: fechaConsulta,
            encargado: tarea.encargado,
            motivo: "Debes ingresar el motivo",
            motivoEstado: false,
          });
          await taskNotDone.save()
          tarea.fechaConsulta = hoy.toJSDate();
          await tarea.save();
          tasksToReturn.push(tarea);
        } else {
          tasksToReturn.push(tarea);
        }
      }
    }
    res.status(200).json({ message: "ok", tasksToReturn });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar los registros",
    });
    next(error);
  }
};

//Metodo para listar todas las tareas de un equipo especifico
const listbyequipo = async (req, res) => {
  const equipo = req.params.id;
  try {
    const tasks = await TaskToDo.find({ equipo }); //Busco todas las tareas dentro de tasktodo
    const tasksToReturn = []; //inicializo un arreglo de tareas a retornar

    for (const task of tasks) {
      // Si no hay fecha de ultima ejecución y tampoco hay fecha de consulta significa que la tarea fue cargada
      // en la BD pero no fue iniciada por el administrador para que sea ejecutada
      if (!task.ultimaEjecucion && !task.fechaConsulta) {
        res.status(200).json({ message: "No hay Tareas programadas"});
        return;
      // Si la tarea no tiene ultimaEjecución pero si fechaConsulta, significa que el admin ya dio inicio a la 
      // tarea, y se trata de la primera vez que se muestra, por lo tanto debo chequear que fechaConsulta sea
      // igual a la fecha de hoy, si es así pusheo la tarea al arreglo, si la fecha de hoy es diferente a 
      // fechaConsulta, significa que desde que se inicio no se hizo, por lo que se debe generar un nuevo 
      // registro en taskNotDone.  
      }else if (!task.ultimaEjecucion && task.fechaConsulta) {
        const hoy = DateTime.local().startOf('day'); //genero una variable con la fecha de hoy
        const frecuencia = task.frecuencia; //genero una variable y asigno la frecuencia del objeto
        console.log(frecuencia);
        const fechaConsulta = DateTime.fromISO(task.fechaConsulta.toISOString());
        console.log(fechaConsulta);
        //genero una variable y le asigno un valor numerico dependiendo del valor de frecuencia, para mensual utilizo el metodo de luxon para calcular los dias del mes
        const diasFrecuencia = {
          Diaria: 1,
          Semanal: 7,
          Quincenal: 14,
          Mensual: hoy.daysInMonth,
        }[frecuencia];

        const diasDesdeUltimaConsulta = hoy.diff(fechaConsulta, "days").days;
        console.log(diasDesdeUltimaConsulta);
        if (diasDesdeUltimaConsulta >= diasFrecuencia && !fechaConsulta.hasSame(hoy, "day")) {
          
          tasksToReturn.push(task);
          const fechaDone = fechaConsulta;
          task.fechaConsulta = hoy.toJSDate();
              await task.save();

              const taskNotDone = new TaskNotDone({
                task: task._id,
                fechaDone: fechaDone,
                encargado: task.encargado,
                motivo: "Debes ingresar el motivo",
                motivoEstado: false,
              });

              await taskNotDone.save()

        } else {
        tasksToReturn.push(task);
      }  

        // Si la tarea tiene una fecha guardada en ultimaEjecucion, es decir no es null
      } else if (task.ultimaEjecucion) {
        
        const hoy = DateTime.local().startOf('day'); //genero una variable con la fecha de hoy
        const ultimaEjecucion = DateTime.fromISO(task.ultimaEjecucion.toISOString()); //genero una variable y asigno la fecha del obtjeto
        const frecuencia = task.frecuencia; //genero una variable y asigno la frecuencia del objeto
        
        //genero una variable y le asigno un valor numerico dependiendo del valor de frecuencia, para mensual utilizo el metodo de luxon para calcular los dias del mes
        const diasFrecuencia = {
          Diaria: 1,
          Semanal: 7,
          Quincenal: 14,
          Mensual: hoy.daysInMonth,
        }[frecuencia];
        
        //genero una nueva variable a la que le asigno como valor, la diferencia en dias de ultimaEjecucion versus la variable hoy
        const diasDesdeUltimaEjecucion = hoy.diff(ultimaEjecucion, "days").days;
        const fechaHoy = hoy.toJSDate();
        console.log("Segundo CL" + fechaHoy);
        
        // Si la tarea debe ejecutarse hoy y su última ejecución fue antes de hoy, la agregamos al arreglo de tareas a retornar
        if (diasDesdeUltimaEjecucion >= diasFrecuencia && !ultimaEjecucion.hasSame(hoy, "day")) {
        // Si el estado de la tarea es true, estamos verificando que la tarea tiene una fecha de ejecución
        // y su estado es true, por lo tanto, pasamos estado a false, seteamos fechaConsulta con la fecha de hoy y
        // guardamos los registros en la tarea a realizar
          if (task.estado) {

            tasksToReturn.push(task);
            console.log(task.estado);
            task.estado = false;
            task.fechaConsulta = hoy.toJSDate();
            console.log(task.estado);
            await task.save();
        // Si la tarea debe ejecutarse hoy y su estado es false, pregunto si fechaConsulta es igual a hoy, esto 
        // significa que voy a mostrar la tarea y es util para consultas en distintos momentos del día que no se 
        // haya cumplido la tarea      
          } else if (!task.estado) {
            if (task.fechaConsulta.getTime() === fechaHoy.getTime()) {
              console.log("tercer CL" + task.fechaConsulta);
              console.log("cuarto CL" + fechaHoy);
              tasksToReturn.push(task);
            // Si el estado es false y fechaConsulta es distinto a hoy muestro la tarea, pero modifico fechaConsulta
            // con la fecha de hoy y genero un nuevo registro de tarea no realizada.    
            } else {
              
              tasksToReturn.push(task);
              const fechaDone = task.fechaConsulta;
              task.fechaConsulta = hoy.toJSDate();
              await task.save();

              const taskNotDone = new TaskNotDone({
                task: task._id,
                fechaDone: fechaDone,
                encargado: task.encargado,
                motivo: "Debes ingresar el motivo",
                motivoEstado: false,
              });

              await taskNotDone.save();
            }
          } else {
            // Si la tarea ya fue ejecutada hoy, actualizamos la fecha de última ejecución
            task.ultimaEjecucion = hoy.toJSDate();
            await task.save();
          }
        }
      }
    }

    res.status(200).json({ message: "ok", tasks: tasksToReturn });
    console.log(tasksToReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Metodo para listar todas las mismas tareas
const listbytarea = async (req, res, next) => {
  try {
    let tareas = await TaskToDo.find({});
    res.send({
      status: "Succes",
      message: "Consulta de registros exitosa",
      tareas,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar los registros",
    });
    next(error);
  }
};

// Metodo para dar cumplimiento a una tarea

const cumplirTarea = async (req, res) => {
  const Id = req.params.id;
  const tiempo = req.body.tiempo;
  const fechaDone = DateTime.local().toISODate();
  const encargado = req.body.encargado;
  const ejecutante = req.body.ejecutante;
  const comentarios = req.body.comentarios;

  try {
    const task = await TaskToDo.findById(Id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const taskDone = new TaskDone({
      Id,
      fechaDone,
      tiempo,
      encargado,
      ejecutante,
      comentarios,
    });

    await taskDone.save();

    task.ultimaEjecucion = fechaDone;
    task.estado = true;
    await task.save();

    res.status(200).json({ message: "Tarea realizada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Metodo para modificar registros
const update = async (req, res, next) => {
  try {
      let tarea = await TaskToDo.updateOne({ _id: req.params.id }, req.body, { multi: false });
      res.json({
          status: "Succes",
          message: "Registro modificado Correctamente",
          tarea
      })
  } catch (error) {
      res.send({
          status: "Error",
          message:"Error al modificar registro",
          error
      })
      next(error);
  }
}

//Metodo para modificar fechaConsulta
const updateFechaConsulta = async (req, res, next) => {
  try {
    // Encuentro la tarea por su ID
    const tarea = await TaskToDo.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        status: "Error",
        message: "No se encontró la tarea",
      });
    }

    // Verifica si fechaConsulta es null y establece la fecha actual o viceversa
    if (tarea.fechaConsulta === null) {
      tarea.fechaConsulta = DateTime.local().toISODate();
    } else {
      tarea.fechaConsulta = null;
    }

    // Guarda la tarea actualizada
    await tarea.save();

    res.json({
      status: "Success",
      message: "Fecha de consulta actualizada correctamente",
      tarea
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Error al actualizar la fecha de consulta",
      error: error.message
    });
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
