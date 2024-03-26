const {Schema, model} = require("mongoose");

const TaskNotDoneSchema = Schema({
    task: {
        type: Schema.ObjectId,
        ref: "TaskToDo",
        autopopulate: true
    },
    fechaDone: {
        type: Date,
        default: Date.now
    },
    encargado: String,
    motivo: String,
    motivoEstado: {
        type: Boolean,
        default: false,
    },


})
TaskNotDoneSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("TaskNotDone", TaskNotDoneSchema, "tasksNotdone");