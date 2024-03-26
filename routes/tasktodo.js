const express = require("express");
const router = express.Router();
const TaskToDoController = require("../controllers/tasktodo");
const check = require("../middlewares/auth");

router.post("/save", check.auth, TaskToDoController.save);
router.delete("/delete/:id", check.auth, TaskToDoController.deleteTaskToDo);
router.get("/listbyuser/:id", check.auth, TaskToDoController.listbyuser);
router.get("/listall", TaskToDoController.listAll);
router.get("/listbyequipo/:id", check.auth, TaskToDoController.listbyequipo);
router.get("/listbytarea", check.auth, TaskToDoController.listbytarea);
router.post("/cumplirtarea/:id", check.auth, TaskToDoController.cumplirTarea);
router.put("/update/:id", check.auth, TaskToDoController.update);
router.get("/updatefechaconsulta/:id", check.auth, TaskToDoController.updateFechaConsulta);

// exportar router
module.exports = router;