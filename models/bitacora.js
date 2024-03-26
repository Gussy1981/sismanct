const {Schema, model} = require("mongoose");
const { DateTime } = require('luxon');

const BitacoraSchema = Schema({
  content: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: () => DateTime.now().startOf('day').toJSDate()
  }
});

module.exports = model("Bitacora", BitacoraSchema, "bitacoras");
