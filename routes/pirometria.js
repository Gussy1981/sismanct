const express = require("express");
const router = express.Router();
const PirometriaController = require("../controllers/pirometria");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", check.auth, PirometriaController.save);
router.delete("/delete/:id", check.auth, PirometriaController.eliminarPirometria);
router.put("/update/:id", check.auth, PirometriaController.actualizarPirometria);
router.get("/listall", check.auth, PirometriaController.listAll);
router.get("/listbyinicio", check.auth, PirometriaController.listByInicio);
router.get("/updateinicio/:id", check.auth, PirometriaController.updateInicio);
//router.get("/listbyequipo/:id", check.auth, RepuestosController.listbyequipo);
//router.get("/listbycuantity", check.auth, RepuestosController.listbyquantity);

// exportar router
module.exports = router;
