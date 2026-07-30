const RegistroPirometria = require('../models/pirometriaDone');
const Pirometria = require('../models/pirometria');
const { DateTime } = require("luxon");

// Controlador para crear un nuevo registro
const save = async (req, res) => {
  try {
    const { numColumnas, numFilas, columnas, equipo, responsable, resultado, vistoBueno, pirometroPatron, termocuplaPatron,observaciones } = req.body;
    const Id = req.body._id;
    const fechaControl = DateTime.now();
    const pirometria = await Pirometria.findById(Id);

    if (!pirometria) {
        return res.status(404).json({ message: "Pirometria no encontrada" });
      }

    // El próximo control (proximoControl / estado) recién se define cuando el
    // control queda validado como OK (ver updatePiroDone), no al cargar los datos
    const registroPirometria = new RegistroPirometria({
      numColumnas,
      numFilas,
      columnas,
      equipo,
      responsable,
      fechaControl,
      resultado,
      vistoBueno,
      pirometroPatron,
      termocuplaPatron,
      observaciones,

    });

    const savedRegistroPirometria = await registroPirometria.save();

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
      const registroActualizado = await RegistroPirometria.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!registroActualizado) {
        return res.status(404).json({ status: "Error", message: "Registro no encontrado" });
      }

      // El reloj de 3 meses para el próximo control recién arranca cuando el
      // control queda validado como OK, no cuando se cargaron los datos
      if (registroActualizado.resultado === "OK") {
        const proximoControl = DateTime.now().plus({ months: 3 }).toJSDate();

        registroActualizado.proximoControl = proximoControl;
        await registroActualizado.save();

        await Pirometria.findOneAndUpdate(
          { equipo: registroActualizado.equipo },
          { estado: true, proximoControl }
        );
      }

      res.json({
          status: "Success",
          message: "Registro modificado Correctamente",
          dataToUpdate: registroActualizado
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
