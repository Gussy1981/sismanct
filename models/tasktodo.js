const { Schema, model } = require("mongoose");

const TaskToDoSchema = Schema({

    equipo: String,
    tarea: String,
    encargado: String,
    frecuencia: {
      type: String,
      enum: [
        "Diaria",
        "Semanal",
        "Quincenal",
        "Mensual",
        "Trimestral",
        "Semestral",
        "Anual",
      ],
      default: "Diaria",
    },
    // Mes (1-12) en el que arranca el ciclo para las frecuencias ancladas a
    // calendario (Trimestral / Semestral / Anual). Null para el resto.
    mesAncla: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    ultimaEjecucion: {
      type: Date,
      default: null
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaConsulta: {
      type: Date,
      default: null
    },
});

TaskToDoSchema.plugin(require("mongoose-autopopulate"));  
module.exports = model("TaskToDo", TaskToDoSchema, "taskstodo");