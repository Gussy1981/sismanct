const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task");
const check = require("../middlewares/auth");

router.post("/save", check.auth, TaskController.save);
router.delete("/delete/:id", check.auth, TaskController.deleteTarea);
router.put("/update/:id", check.auth, TaskController.update);
router.get("/listall", check.auth, TaskController.listAll);
router.get("/listone/:id", check.auth, TaskController.listOne);

// exportar router
module.exports = router;