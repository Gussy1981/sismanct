const express = require("express");
const router = express.Router();
const TaskNotDoneController = require("../controllers/taskNotDone");
const check = require("../middlewares/auth");

router.post("/save", check.auth, TaskNotDoneController.save);
router.delete("/delete/:id", check.auth, TaskNotDoneController.deleteTaskNotDone);
router.get("/listall", check.auth, TaskNotDoneController.listAll);
router.get("/findbyuser/:name", check.auth, TaskNotDoneController.findbyuser);
router.put("/update/:id", check.auth, TaskNotDoneController.update);


//exportar router
module.exports = router;
