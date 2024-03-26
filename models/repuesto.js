const {Schema, model} = require("mongoose");

const RepuestoSchema = Schema({
    nombre: {
        type: String
    },
    marca: String,
    tipo: String,
    otras: String,
    cantidad: {
        type: Number,
        min: 0,
    },
    minStock: {
        type: Number,
        min: 1,
    },
    equipo: String,
    precio: Number,
    });
module.exports = model("Repuesto", RepuestoSchema, "repuestos");