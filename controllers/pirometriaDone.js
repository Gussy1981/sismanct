const RegistroPirometria = require('../models/pirometriaDone');
const Pirometria = require('../models/pirometria');
const { DateTime } = require("luxon");

// Controlador para crear un nuevo registro
const save = async (req, res) => {
  try {
    const { numColumnas, numFilas, columnas, equipo, responsable, resultado, vistoBueno, pirometroPatron, termocuplaPatron,observaciones } = req.body;
    const Id = req.body._id;
    const fechaControl = DateTime.now();
    const nextControl = fechaControl.plus({months: 3});
    const proximoControl = nextControl
    const pirometria = await Pirometria.findById(Id);

    if (!pirometria) {
        return res.status(404).json({ message: "Pirometria no encontrada" });
      }
    
    const registroPirometria = new RegistroPirometria({
      numColumnas,
      numFilas,
      columnas,
      equipo,
      responsable,
      fechaControl,
      proximoControl,
      resultado,
      vistoBueno,
      pirometroPatron,
      termocuplaPatron,
      observaciones,

    });

    const savedRegistroPirometria = await registroPirometria.save();

    const fechaActual = DateTime.local();
    const fechaProximoControl = fechaActual.plus({months: 3});
    const fechaProximaFormated = fechaProximoControl.toISODate();
    pirometria.proximoControl = fechaProximaFormated;
    pirometria.estado = true;

    await pirometria.save();
    

    res.status(201).json({
        status: "Success",
        Message: "Registro generado correctamente",
        savedRegistroPirometria
    });
  } catch (error) {
    console.error('Error al crear el registro de pirometría', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener registros de pirometría
const listAll = async (req, res) => {
  try {
    const registros = await RegistroPirometria.find();
    res.status(200).json({
        status: "Success",
        message: "Registros listados correctamente",
        registros,
    });
  } catch (error) {
    console.error('Error al obtener los registros de pirometría', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Metodo para modificar registros
const updatePiroDone = async (req, res, next) => {
  try {
      let dataToUpdate = await RegistroPirometria.updateOne({ _id: req.params.id }, req.body, { multi: false });
      res.json({
          status: "Success",
          message: "Registro modificado Correctamente",
          dataToUpdate
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

module.exports = {
    save,
    listAll,
    updatePiroDone,
  };
