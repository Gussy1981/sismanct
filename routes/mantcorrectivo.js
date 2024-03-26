const express = require("express");
const router = express.Router();
const CorrectivoController = require("../controllers/mantcorrectivo");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", CorrectivoController.save);
router.delete("/delete/:id", check.auth, CorrectivoController.deleteCorrectivo);
router.put("/update/:id", check.auth, CorrectivoController.update);
router.get("/findByMotivo/:id", check.auth, CorrectivoController.findByMotivo);
router.get("/findMotivoByEquipo/:equipoId/:motivoId", check.auth, CorrectivoController.findMotivoByEquipo);
router.get("/listall", CorrectivoController.listAll);

// exportar router
module.exports = router;