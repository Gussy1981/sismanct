const { Schema, model } = require("mongoose");

const PirometriaDoneSchema = Schema({
  numColumnas: Number,
  numFilas: Number,
  columnas: Object,
  equipo: String,
  responsable: String,
  fechaControl: {
    type: Date,
    default: null,
  },
  proximoControl: {
    type: Date,
    default: null,
  },
  resultado: {
    type: String,
    default: null,
  },
  vistoBueno: {
    type: String,
    default: null,
  },
  pirometroPatron: String,
  termocuplaPatron: String,
  observaciones: String,
});
module.exports = model("PirometriaDone", PirometriaDoneSchema, "pirometriasdone");
