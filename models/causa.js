const {Schema, model} = require("mongoose");

const CausaCorrectivoSchema = Schema({
    motivo: {
        type: String,
        unique: true,
        trim: true
    }
});

module.exports = model("CausaCorrectivo", CausaCorrectivoSchema, "causacorrectivos");