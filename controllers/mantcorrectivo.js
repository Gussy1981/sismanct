const Correctivo = require("../models/mantcorrectivo");
const Repuesto = require("../models/repuesto");

//Metodo para guardar registros

const save = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const {
      fecha,
      equipo,
      solicitante,
      motivo,
      tareas,
      tiempo,
      repuestosUtilizados,
      responsables,
    } = req.body;

    // Verificar si hay suficiente cantidad de repuestos disponibles en el stock
const repuestosDB = await Repuesto.find({
  _id: { $in: repuestosUtilizados.map((r) => r.id_repuesto) },
});

console.log("repuestosUtilizados (before repuestosDB):", repuestosUtilizados);
console.log("repuestosDB:", repuestosDB);

for (let i = 0; i < repuestosDB.length; i++) {
  if (repuestosDB[i].cantidad < repuestosUtilizados[i].cantidad) {
    return res
      .status(400)
      .json({ mensaje: "Cantidad insuficiente de repuesto" });
  }
}

// Actualizar la cantidad de repuestos en el stock y crear el registro de mantenimiento
const repUtilizados = [];
for (const [i, repuestoInfo] of repuestosUtilizados.entries()) {
  const idRepuesto = repuestoInfo.id_repuesto;
  const cantidadUtilizada = repuestoInfo.cantidad;
  console.log("repUtilizados:", repUtilizados);

  const repuestoDB = await Repuesto.findOne({ _id: idRepuesto });
  repuestoDB.cantidad -= cantidadUtilizada;
  await repuestoDB.save();

  repUtilizados.push({
    id_repuesto: idRepuesto,
    cantidad: cantidadUtilizada,
  });
}


    // Crear el nuevo mantenimiento correctivo con la información de repuestos utilizados
    const nuevoCorrectivo = new Correctivo({
      fecha,
      equipo,
      solicitante,
      motivo,
      tareas,
      tiempo,
      repuestosUtilizados: repUtilizados, // Utilizamos el array de repuestos utilizados
      responsables,
    });

    await nuevoCorrectivo.save();
    res.status(201).json(nuevoCorrectivo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al crear el correctivo" });
  }
};

//metodo para filtar mantenimientos correctivos por su causa

const findByMotivo = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;

    const correctivos = await Correctivo.find({ motivo: id })
      .select({ equipo: 1, motivo: 1, responsable: 1, createdAt: 1, tareas: 1 })
      .exec();
    const formattedCorrectivos = correctivos.map((correctivo) => {
      return {
        ...correctivo._doc,
        createdAt: new Date(correctivo.createdAt).toLocaleDateString(),
      };
    });

    res.status(200).json(formattedCorrectivos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ mensaje: "Error al buscar los correctivos por el id de motivo" });
  }
};

const findMotivoByEquipo = async (req, res) => {
  try {
    const { equipoId, motivoId } = req.params;

    const correctivos = await Correctivo.find({
      equipo: equipoId,
      motivo: motivoId,
    });

    const resultado = correctivos.map((correctivo) => ({
      equipo: correctivo.equipo,
      motivo: correctivo.motivo,
      responsable: correctivo.responsable,
      fecha: correctivo.createdAt.toLocaleDateString(), //Modifico el formato de la fecha a algo mas entendible
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        mensaje: "Error al buscar los correctivos por el id de equipo y motivo",
      });
  }
};

const deleteCorrectivo = async (req, res, next) => {
  try {
    let correctivo = await Correctivo.deleteOne({ _id: req.params.id });
    return res.status(200).send({
      status: "Succes",
      message: "Registro Eliminado",
      correctivo,
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
    let correctivo = await Correctivo.updateOne(
      { _id: req.params.id },
      req.body,
      { multi: false }
    );
    res.send({
      status: "Success",
      message: "Registro modificado Correctamente",
      correctivo,
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
const listAll = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const sortColumn = req.query.sortColumn || "fecha";
    const sortOrder = req.query.sortOrder || "asc";
    console.log(searchTerm);

    const filters = [];

    if (searchTerm) {
      filters.push({
        $or: [
          { tareas: { $regex: new RegExp(searchTerm, 'i') } },
          { equipo: { $regex: new RegExp(searchTerm, 'i') } },
          { solicitante: { $regex: new RegExp(searchTerm, 'i') } },
          { motivo: { $regex: new RegExp(searchTerm, 'i') } },
          { responsables: { $regex: new RegExp(searchTerm, 'i') } }
        ]
      });
    }

    const sortOptions = {};
    sortOptions[sortColumn] = sortOrder === "asc" ? 1 : -1;

    const correctivos = await Correctivo.find(filters.length > 0 ? { $or: filters } : {}).sort(sortOptions);
    res.json(correctivos);
  } catch (error) {
    console.error("Error al obtener o buscar correctivos", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};





module.exports = {
  save,
  findByMotivo,
  findMotivoByEquipo,
  deleteCorrectivo,
  update,
  listAll,
};
