const TaskDone = require("../models/taskdone");

//importar servicio
const taskDoneService = require("../services/taskDoneService")


//Metodo para guardar registros
const save = async (req, res, next) => {
    try {
        const { task, fechaDone, tiempo, encargado, ejecutante, comentarios } = req.body;
        const nuevaTareaCumplida = new TaskDone({
            task,
            fechaDone,
            tiempo,
            encargado,
            ejecutante,
            comentarios,
        });
        await nuevaTareaCumplida.save();
        res.status(200).json({ message: "Tarea cumplida guardada con éxito"});
    } catch (error) {
        res.send({
            status: "Error",
            message: "Error al crear registro",
            error
        })
        next(error)
    }

};
//Metodo para eliminar registros
const deleteTaskDone = async (req, res, next) => {
    try {
        let tareaDone = await TaskDone.deleteOne({ _id: req.params.id })
        return res.status(200).send({
            status: "Succes",
            message: "Registro Eliminado",
            tareaDone
        });

    } catch (error) {
        res.send({
            status: "Error",
            message: "Error al eliminar registro",
            error
        })
        next(error);
    }
}
//Metodo para listar todas las tareas
const listAll = async (req, res, next) => {
    try {
        let tasksdone = await TaskDone.find({})
        res.send({
            status:"Succes",
            message:"Consulta de registros exitosa",
            tasksdone
        })
        
    } catch (error) {
        res.send({
            status: "Error",
            message: "Error al mostrar los registros"
        });
        next(error);
    }
}

//Metodo para filtrar tareas hechas por equipo
    const findbyequipo = async (req, res, next) => {
        try {
        const id = (req.params.id);
        console.log(id)

        let findByEquipo = await taskDoneService.equiposToFind(id); //llamo al servicio donde busco las taskToDo que coincidan con el criterio de busqueda por equipo

        let response = await TaskDone.find({"task": findByEquipo.equiposFinded})// Aplico a la busqueda de tareas que coincidan con el resultado del servicio                      
                                    
            res.send({
                status: "succes",
                message: "Consulta realizada con exito",
                response
            });
        } catch (error) {
            res.send({
                status: "Error",
                message: "Error al mostrar los registros"
        }); 
        next(error);
        }
    }
       
        
    

//Metodo para listar todas las tareas de un usuario especifico
const findbyuser = async (req, res, next) => {
    try {
    const id = (req.params.id);
    console.log(id)

    let findEncargado = await taskDoneService.userToFind(id);

    let response = await TaskDone.find({"task": findEncargado.userFinded})
                            
        res.send({
            status: "succes",
            message: "Consulta realizada con exito",
            response
        });
    } catch (error) {
        res.send({
            status: "Error",
            message: "Error al mostrar los registros"
    }); 
    next(error);
    }
}


module.exports = {
    save,
    deleteTaskDone,
    listAll,
    findbyuser,
    findbyequipo,
}