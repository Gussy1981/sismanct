const equipo = require("../models/equipo");
const Equipo = require("../models/equipo");
const fs = require("fs");

const save = async (req, res, next) => {
  try {
    const { clasificacion, codigo, tipo, temperaturaDeTrabajo, caracteristicasDeCalentamiento } = req.body;
    const file = req.file;

    let equipo = new Equipo({
      clasificacion,
      codigo,
      tipo,
      temperaturaDeTrabajo,
      caracteristicasDeCalentamiento,
    });

    // Verificar si se proporcionó un archivo antes de intentar acceder a sus propiedades
    if (file) {
      equipo.urlImagen = file.path;
    }

    let documento = await equipo.save();
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
const deleteEquipo = async (req, res, next) => {
  try {
    let equipo = await Equipo.deleteOne({ _id: req.params.id });
    return res.status(200).send({
      status: "Succes",
      message: "Registro Eliminado",
      equipo,
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
    let equipo = await Equipo.updateOne({ _id: req.params.id }, req.body, {
      multi: false,
    });
    res.json({
      status: "Success",
      message: "Registro modificado Correctamente",
      equipo,
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
    let equipo = await Equipo.find({});
    res.json({
      status: "Succes",
      message: "Listado Completo correcto",
      equipo,
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
    const equipo = await Equipo.find({ codigo: req.params.codigo });

    console.log(equipo);
    res.send({
      status: "Succes",
      message: "Listado por unidad correcto",
      equipo,
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

//Metodo para listar según su clasificación
const listByClass = async (req, res, next) => {
  try {
    const classToFind = req.params.clasificacion;
    const equipo = await Equipo.findById({ clasificacion: classToFind });

    console.log(equipo);
    res.send({
      status: "Succes",
      message: "Listado por clasificacion correcto",
      equipo,
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

//Metodo para Actualizar imagenes (esquemas de horno)

const updateImage = async (req, res, next) => {
    const file = req.file;
    const id = req.params.id;
  try {
    if (!file) {
      return res.status(404).send({
        status: "Error",
        message: "Archivo no encontrado",
      });
    }

    let image = file.originalname;

    const imageSplit = image.split(".");
    const extension = imageSplit[1];

    if (
      extension != "png" &&
      extension != "fw" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      const filePath = file.path;
      const fileDeleted = fs.unlinkSync(filePath);
      return res.status(400).send({
        status: "Error",
        message: "Extension del archivo incompatible",
      });
    }

    console.log(file.path);
    console.log(id);



    const equipo = await Equipo.updateOne({_id: id}, {urlImagen: file.path}, {multi: false});
    res.json({
        status: "Succes",
        message: "Registro modificado Correctamente",
        equipo,
    });

  } catch (error) {
    res.send({
        status: "Error",
        message: "Error al modificar/guardar registro",
        error,
      });
      next(error);
  }
};



module.exports = {
  save,
  deleteEquipo,
  update,
  listAll,
  listOne,
  listByClass,
  updateImage,
};
