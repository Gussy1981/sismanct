const {Schema, model} = require("mongoose");

const TaskDoneSchema = Schema({
    task: {
        type: Schema.ObjectId,
        ref: "TaskToDo",
        autopopulate: true
    },
    fechaDone: {
        type: Date,
        default: Date.now
    },
    tiempo: Number,
    encargado: String,
    ejecutante: String,
    comentarios: String,


})
TaskDoneSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("TaskDone", TaskDoneSchema, "tasksdone");