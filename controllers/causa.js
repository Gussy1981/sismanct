const CausaCorrectivo = require("../models/causa");

//Metodo para guardar registros
const save = async (req, res, next) => {
    try {
        let causa = new CausaCorrectivo({
            motivo: req.body.motivo
        })
        let documento = await causa.save()
        res.json({
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
const deleteCausa = async (req, res, next) => {
    try {
        let causa = await CausaCorrectivo.deleteOne({ _id: req.params.id })
        return res.status(200).send({
            status: "Succes",
            message: "Registro Eliminado",
            causa
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
        let causa = await CausaCorrectivo.updateOne({ _id: req.params.id }, req.body, { multi: false });
        res.json({
            status: "Succes",
            message: "Registro modificado Correctamente",
            causa
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
        let causa = await CausaCorrectivo.find({});
        res.json({
            status: "Succes",
            message: "Listado Completo correcto",
            causa
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
        const causa = await CausaCorrectivo.findById(req.params.id);
        res.send({
            status: "Succes",
            message: "Listado por unidad correcto",
            causa
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
    deleteCausa,
    update,
    listAll,
    listOne
}