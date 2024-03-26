const { Schema, model } = require("mongoose");

const PirometriaSchema = Schema({
  numColumnas: Number,
  numFilas: Number,
  columnas: Object,
  equipo: String,
  temperatura: String,
  responsable: String,
  fechaControl: {
    type: Date,
    default: null,
  },
  proximoControl: {
    type: Date,
    default: null,
  },
  estado: {
    type: Boolean,
    default: false
  },
  inicio: {
    type: Boolean,
    default: false
  },
});
module.exports = model("Pirometria", PirometriaSchema, "pirometrias");
