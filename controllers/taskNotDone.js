const TaskNotDone = require("../models/taskNotDone");

//importar servicio
const taskNotDoneService = require("../services/taskDoneService");

//Metodo para guardar registros
const save = async (req, res, next) => {
  try {
    const { task, fechaDone, encargado, motivo } = req.body;
    const nuevaTareaNoCumplida = new TaskNotDone({
      task,
      fechaDone,
      encargado,
      motivo,
      motivoEstado,
    });
    await nuevaTareaNoCumplida.save();
    res.status(200).json({ message: "Tarea No cumplida guardada con éxito" });
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
const deleteTaskNotDone = async (req, res, next) => {
  try {
    let tareaNotDone = await TaskNotDone.deleteOne({ _id: req.params.id });
    return res.status(200).send({
      status: "Succes",
      message: "Registro Eliminado",
      tareaNotDone,
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
//Metodo para listar todas las tareas
const listAll = async (req, res, next) => {
  try {
    let taskNotdone = await TaskNotDone.find({});
    res.send({
      status: "Succes",
      message: "Consulta de registros exitosa",
      taskNotdone,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar los registros",
    });
    next(error);
  }
};
//Metodo para listar todas las tareas de un usuario especifico
/*const findbyuser = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);

    let findEncargado = await taskNotDoneService.userToFind(id);

    let newData = await TaskNotDone.find({ task: findEncargado.userFinded });

    res.json({
      status: "Success",
      message: "Consulta exitosa",
      newData,
    });
  } catch (error) {
    res.json({
      status: "Error",
      Message: "Error al procesar los registros",
    });
    next(error);
  }
};*/

const findbyuser = async (req, res) => {
  const  name  = req.params.name;
  console.log( name );
  try {

    const newData = await TaskNotDone.find({
      encargado: name,
      motivoEstado: false,
    }).populate({
      path: "task",
      populate: {
        path: "equipo",
        select: "-__v",
      },
    });
    return res.status(200).json({
      status: "Success",
      message: "Consulta de registros exitosa",
      newData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Error al obtener las tareas",
      error: error.message,
    });
  }
};


//Metodo para modificar registros
const update = async (req, res, next) => {
  try {
    let taskNotDone = await TaskNotDone.updateOne(
      { _id: req.params.id },
      req.body,
      { multi: false }
    );
    res.json({
      status: "Succes",
      message: "Registro modificado Correctamente",
      taskNotDone,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al modificar registro",
      error,
    });
    next(error);
  }
};

module.exports = {
  save,
  deleteTaskNotDone,
  listAll,
  findbyuser,
  update,
};
