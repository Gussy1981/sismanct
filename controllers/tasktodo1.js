const getTasksToDo = async (req, res) => {
    try {
      const tasks = await TaskToDo.find({});
      const tasksToReturn = [];
      console.log(tasks);
  
      for (const task of tasks) {
        if (task.debeEjecutarseHoy() && !task.ultimaEjecucion) {
          // Si la tarea debe ejecutarse hoy y no ha sido ejecutada todavía, la agregamos al arreglo de tareas a retornar
          tasksToReturn.push(task);
        } else if (task.debeEjecutarseHoy() && task.ultimaEjecucion) {
          const hoy = DateTime.local();
          const ultimaEjecucion = DateTime.fromJSDate(task.ultimaEjecucion);
          const frecuencia = task.frecuencia;
          const diasFrecuencia = {
            Diaria: 1,
            Semanal: 7,
            Quincenal: 14,
            Mensual: hoy.daysInMonth,
          }[frecuencia];
          const diasDesdeUltimaEjecucion = hoy.diff(ultimaEjecucion, 'days').days;
  
          // Si la tarea debe ejecutarse hoy y su última ejecución fue antes de hoy, la agregamos al arreglo de tareas a retornar
          if (diasDesdeUltimaEjecucion >= diasFrecuencia) {
            tasksToReturn.push(task);
          } else {
            // Si la tarea ya fue ejecutada hoy, actualizamos la fecha de última ejecución
            task.ultimaEjecucion = new Date();
            await task.save();
          }
        }
      }
  
      res.status(200).json({ message: "ok", tasks: tasksToReturn });
      console.log(tasksToReturn)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };