const { DateTime } = require('luxon');
const {Schema, model} = require("mongoose");

const PedidoMantSchema = Schema({
    solicitante: String,
    equipo: String,
    fecha: {
        type: Date,
        default: () => DateTime.now().startOf('day').toJSDate()
    },
    motivo: String,
    condicion: {
        type: String,
        enum: ["Urgente", "Normal"],
        default: "Normal",
      },
    cumplido: {
        type: Boolean,
        default: false
    }, 

    });

module.exports = model("PedidoMant", PedidoMantSchema, "pedidosMant");