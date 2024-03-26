const express = require("express");
const router = express.Router();
const TaskDoneController = require("../controllers/taskdone");
const check = require("../middlewares/auth");

router.post("/save", check.auth, TaskDoneController.save);
router.delete("/delete/:id", check.auth, TaskDoneController.deleteTaskDone);
router.get("/listall", check.auth, TaskDoneController.listAll);
router.get("/findbyuser/:id", check.auth, TaskDoneController.findbyuser);
router.get("/findbyequipo/:id", check.auth, TaskDoneController.findbyequipo);




//exportar router
module.exports = router;