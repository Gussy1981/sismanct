const Pedido = require("../models/pedidoMant");

//Metodo para guardar registros
const save = async (req, res, next) => {
    try {
        const params = req.body;
        let pedido = new Pedido({
            solicitante: params.solicitante,
            equipo: params.equipo,
            motivo: params.motivo,
            condicion: params.condicion
        })
        let documento = await pedido.save()
        res.send({
            status: "Success",
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
const deletePedido = async (req, res, next) => {
    try {
        let pedido = await Pedido.deleteOne({ _id: req.params.id })
        return res.status(200).send({
            status: "Succes",
            message: "Registro Eliminado",
            pedido
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
        req.body.cumplido = true;
        let pedido = await Pedido.updateOne({ _id: req.params.id }, req.body, { multi: false });
        res.json({
            status: "Succes",
            message: "Registro modificado Correctamente",
            pedido
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
        let pedido = await Pedido.find({});
                                 
        res.json({
            status: "Succes",
            message: "Listado Completo correcto",
            pedido
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
const listByCumplido = async (req, res, next) => {
    console.log(req.params);
    try {
        const pedido = await Pedido.find({cumplido:false})
                                   
        console.log(pedido)
        res.send({
            status: "Succes",
            message: "Listado por unidad correcto",
            pedido
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
    deletePedido,
    update,
    listAll,
    listByCumplido,
}