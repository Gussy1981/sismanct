const Pirometria = require("../models/pirometria");
const RegistroPirometria = require("../models/pirometriaDone");
const { DateTime } = require("luxon");
const ARGENTINA_ZONE = "America/Argentina/Buenos_Aires";

// Controlador para crear un nuevo registro de pirometria
const save = async (req, res, next) => {
  try {
    const params = req.body;
    const nuevaPirometria = new Pirometria({
      numColumnas: params.numColumnas,
      numFilas: params.numFilas,
      columnas: params.columnas,
      equipo: params.equipo,
      temperatura: params.temperatura,
      responsable: params.responsable,
      fechaControl: params.fechaControl,
      proximoControl: params.proximoControl,
      estado: params.estado,
      inicio: params.inicio,
    });
    let documento = await nuevaPirometria.save();
    res.status(201).json({
      status: "Success",
      message: "Registro generado correctamente",
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

// Controlador para obtener todas las pirometrias
const listAll = async (req, res) => {
  try {
    const pirometrias = await Pirometria.find();
    res.status(200).json(pirometrias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las pirometrias" });
  }
};

// Controlador para obtener todas las pirometrias con inicio true
const listByInicio = async (req, res) => {

    // Primero consulto si inicio es true y estado false, si es asi guardo el registro 
    // Si hay inicio, estado  && proximoControl pregunto si la fecha de hoy es igual o mayor a la de proximo control
    // si se comprueba lo meto en el array

  try {
    const pirometrias = await Pirometria.find();

    // Equipos con un control ya cargado pero todavía sin validar: no deben
    // volver a pedirle al operario que cargue datos hasta que se valide
    const pendientesDeValidar = await RegistroPirometria.find({ resultado: null })
      .select("equipo")
      .lean();
    const equiposPendientesDeValidar = new Set(pendientesDeValidar.map((r) => r.equipo));

    const pirometriasToReturn = [];

    for (const pirometria of pirometrias) {
      if (equiposPendientesDeValidar.has(pirometria.equipo)) continue;

      if (pirometria.inicio && !pirometria.estado) {
        pirometriasToReturn.push(pirometria);
      } else if (
        pirometria.inicio &&
        pirometria.estado &&
        pirometria.proximoControl
      ) {
        const hoy = DateTime.now().setZone(ARGENTINA_ZONE).startOf("day");
        const nextControl = DateTime.fromJSDate(pirometria.proximoControl).setZone(ARGENTINA_ZONE).startOf("day");
          if (hoy >= nextControl) {
            pirometriasToReturn.push(pirometria);
          }
      }
    }

    res.status(200).json({
      status: "Success",
      message: "Listado Correcto",
      pirometriasToReturn,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las pirometrias" });
  }
};

// Controlador para actualizar una pirometria por su ID
const actualizarPirometria = async (req, res) => {
  try {
    const { id } = req.params;
    const pirometriaActualizada = await Pirometria.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Registro modificado correctamente",
      pirometriaActualizada,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la pirometria" });
  }
};

// Controlador para eliminar una pirometria por su ID
const eliminarPirometria = async (req, res) => {
  try {
    let registro = await Pirometria.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      status: "Success",
      message: "Registro eliminado",
      registro,
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

//Metodo para modificar la propiedad inicio de cada registro
const updateInicio = async (req, res, next) => {
  try {
    // Encuentro la tarea por su ID
    const registro = await Pirometria.findById(req.params.id);

    if (!registro) {
      return res.status(404).json({
        status: "Error",
        message: "No se encontró el registro",
      });
    }

    // Verifico si inicio es false y lo modifico a true
    if (!registro.inicio) {
      registro.inicio = true;
    } else {
      registro.inicio = false;
    }

    // Guardo el registro actualizado
    await registro.save();

    res.json({
      status: "Success",
      message: "Inicio modificado correctamente",
      registro,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Error al actualizar el inicio",
      error: error.message,
    });
    next(error);
  }
};

module.exports = {
  save,
  listAll,
  actualizarPirometria,
  eliminarPirometria,
  updateInicio,
  listByInicio,
};
