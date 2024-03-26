const {Schema, model} = require("mongoose");


const EquipoSchema = Schema({
    clasificacion: {
        type: String,
        enum: ["Maquina", "Infraestructura"],
        default: "Maquina",
    },
    codigo: {
        type: String,
        unique: true,
        required: true
    },
    tipo: String,
    temperaturaDeTrabajo: String,
    urlImagen: String,
    caracteristicasDeCalentamiento: String,
    });

module.exports = model("Equipo", EquipoSchema, "equipos");