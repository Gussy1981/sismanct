const {Schema, model} = require("mongoose");
const { UNIDADES } = require("../services/stockUnits");

const RepuestosSchema = Schema({
    id_repuesto:{
        type: Schema.ObjectId,
        ref: "Repuesto",
        autopopulate: true
    },
    cantidad: Number,
    unidad: {
        type: String,
        enum: UNIDADES,
        default: "Unidad"
    },
    cantidadStock: Number,
    unidadStock: {
        type: String,
        enum: UNIDADES
    }
})

const CorrectivoSchema = Schema({
    fecha: Date,
    equipo: String,
    solicitante: String,
    motivo: String,
    tareas: String,
    tiempo: Number,
    repuestosUtilizados: [RepuestosSchema],
    responsables: [String]
},

);
CorrectivoSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("Correctivo", CorrectivoSchema, "correctivos");
