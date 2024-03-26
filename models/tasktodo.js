const { Schema, model } = require("mongoose");

const TaskToDoSchema = Schema({

    equipo: String,
    tarea: String,
    encargado: String,
    frecuencia: {
      type: String,
      enum: ["Diaria", "Semanal", "Quincenal", "Mensual"],
      default: "Diaria",
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