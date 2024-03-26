const Task = require("../models/task");

//Metodo para guardar registros
const save = async (req, res, next) => {
    try {
        let tarea = new Task({
            task: req.body.task
        })
        let documento = await tarea.save()
        res.send({
            status: "Succes",
            message: "Registro Guardado",
            documento
        });
    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al crear registro",
            error
        })
        next(error)
    }

};
//Metodo para eliminar registros
const deleteTarea = async (req, res, next) => {
    try {
        let tarea = await Task.deleteOne({ _id: req.params.id })
        return res.status(200).send({
            status: "Succes",
            message: "Registro Eliminado",
            tarea
        });

    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al eliminar registro",
            error
        })
        next(error);
    }

};

//Metodo para modificar registros
const update = async (req, res, next) => {
    try {
        let tarea = await Task.updateOne({ _id: req.params.id }, req.body, { multi: false });
        res.send({
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

//Metodo para listar todos los registros
const listAll = async (req, res, next) => {
    console.log(req.query);
    try {
        let tarea = await Task.find({});
        res.send({
            status: "Succes",
            message: "Listado Completo correcto",
            tarea
        })
    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al mostrar registros",
            error
        })
        next(error);
    }
}
//Metodo para listar un solo registro
const listOne = async (req, res, next) => {
    console.log(req.params);
    try {
        const tarea = await Task.findById(req.params.id);
        res.send({
            status: "Succes",
            message: "Listado por unidad correcto",
            tarea
        })
    } catch (error) {
        res.send({
            status: "Error",
            message:"Error al mostrar registro",
            error
        })
        next(error);
    }
}
module.exports = {
    save,
    deleteTarea,
    update,
    listAll,
    listOne
}