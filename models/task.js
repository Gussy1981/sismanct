const {Schema, model} = require("mongoose");

const TaskSchema = Schema({
   task: {
    type: String,
    required: true
   }
});
module.exports = model("Task", TaskSchema, "tasks");