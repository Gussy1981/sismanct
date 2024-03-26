const Bitacora = require("../models/bitacora");

//Metodo para guardar registros
const save = async (req, res, next) => {
    try {
        const { content } = req.body;
        let bitacora = new Bitacora({ content })
        let documento = await bitacora.save()
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


// Controlador para modificar registros
const update = async (req, res, next) => {
    try {
      let bitacora = await Bitacora.updateOne(
        { _id: req.params.id },
        { content: req.body.content }, // Solo actualiza el campo 'content'
        { multi: false }
      );
      res.json({
        status: "Success",
        message: "Registro modificado correctamente",
        bitacora,
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
  

//Metodo para listar todos los registros
const listAll = async (req, res, next) => {
    console.log(req.query);
    try {
        let bitacora = await Bitacora.find({});
                                 
        res.json({
            status: "Succes",
            message: "Listado Completo correcto",
            bitacora
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

//Metodo para listar un registro
const listById = async (req, res, next) => {
    console.log(req.query);
    const { id } = req.params;
    try {
        let bitacora = await Bitacora.findById(id);
                                 
        res.json({
            status: "Succes",
            message: "Registro encontrado",
            bitacora
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

//Metodo para eliminar registros
const deleteBitacora = async (req, res, next) => {
    try {
      let bitacora = await Bitacora.deleteOne({ _id: req.params.id });
      return res.status(200).send({
        status: "Success",
        message: "Registro Eliminado",
        bitacora,
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


module.exports = {
    save,
    update,
    listAll,
    listById,
    deleteBitacora,
}