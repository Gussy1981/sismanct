const {Schema, model} = require("mongoose");
const { UNIDADES } = require("../services/stockUnits");

const RepuestoSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    marca: String,
    tipo: String,
    otras: String,
    cantidad: {
        type: Number,
        min: 0,
    },
    unidadStock: {
        type: String,
        enum: UNIDADES,
        default: "Unidad",
    },
    minStock: {
        type: Number,
        min: 1,
    },
    criticidad: {
        type: String,
        enum: ["Critico", "Normal"],
        default: "Normal",
    },
    equipo: String,
    precio: Number,
    });
module.exports = model("Repuesto", RepuestoSchema, "repuestos");
