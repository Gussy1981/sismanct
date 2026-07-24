const { Schema, model } = require("mongoose");

const MovimientoStockSchema = Schema(
    {
        repuesto: {
            type: Schema.ObjectId,
            ref: "Repuesto",
            required: true,
        },
        tipo: {
            type: String,
            enum: ["ingreso", "egreso"],
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1,
        },
        motivo: {
            type: String,
            enum: ["correctivo", "ajuste_manual"],
            required: true,
        },
        referencia: String,
        usuario: String,
        stockAnterior: Number,
        stockResultante: Number,
    },
    { timestamps: true }
);

MovimientoStockSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("MovimientoStock", MovimientoStockSchema, "movimientosstock");
