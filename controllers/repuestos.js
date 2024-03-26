const Repuesto = require("../models/repuesto");

//Metodo para guardar registros
const save = async (req, res, next) => {
  try {
    let repuesto = new Repuesto({
      nombre: req.body.nombre,
      marca: req.body.marca,
      tipo: req.body.tipo,
      otras: req.body.otras,
      precio: req.body.precio,
      cantidad: req.body.cantidad,
      minStock: req.body.minStock,
      equipo: req.body.equipo,
    });
    let documento = await repuesto.save();
    res.send({
      status: "Success",
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
const deleteRepuesto = async (req, res, next) => {
  try {
    let repuesto = await Repuesto.deleteOne({ _id: req.params.id });
    return res.status(200).send({
      status: "Succes",
      message: "Registro Eliminado",
      repuesto,
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

//Metodo para modificar registros
const update = async (req, res, next) => {
  try {
    let repuesto = await Repuesto.updateOne({ _id: req.params.id }, req.body, {
      multi: false,
    });
    res.json({
      status: "Success",
      message: "Registro modificado Correctamente",
      repuesto,
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
    let repuesto = await Repuesto.find({});

    res.json({
      status: "Succes",
      message: "Listado Completo correcto",
      repuesto,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar registros",
      error,
    });
    next(error);
  }
};
//Metodo para listar un solo registro
const listOne = async (req, res, next) => {
  console.log(req.params);
  try {
    const repuesto = await Repuesto.findById(req.params.id);

    console.log(equipo);
    res.send({
      status: "Succes",
      message: "Listado por unidad correcto",
      repuesto,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar registro",
      error,
    });
    next(error);
  }
};

const listbyequipo = async (req, res, next) => {
  try {
    const equipo = req.params.id;
    let repuesto = await Repuesto.find({ equipo });
    res.send({
      status: "Succes",
      message: "Consulta de registros exitosa",
      repuesto,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Error al mostrar los registros",
    });
    next(error);
  }
};

// Método para listar los repuestos críticos faltantes o con mínimo stock

const listbyquantity = async (req, res, next) => {
  try {
    const repuestosList = await Repuesto.find({});
    const repuestosToReturn = [];

    for (const repuesto of repuestosList) {
      const cantidad = repuesto.cantidad;
      console.log(cantidad);
      const minstock = repuesto.minStock;
      console.log(minstock);
      if (cantidad <= minstock) {
        console.log("Repuesto en falta", repuesto);
        repuestosToReturn.push(repuesto);
      }
      // Luego del bucle verifico si no hay repuestos faltantes y envío respuesta.
    }

    if (repuestosToReturn.length === 0) {
      res.status(200).json({
        status: "Success",
        message: "No hay faltante de repuestos",
      });
      return;
    }
    res.status(200).json({
      status: "Success",
      message: "Listado obtenido correctamente",
      repuestosToReturn,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  save,
  deleteRepuesto,
  update,
  listAll,
  listOne,
  listbyequipo,
  listbyquantity,
};
