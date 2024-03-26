const express = require("express");
const router = express.Router();
const RepuestosController = require("../controllers/repuestos");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", check.auth, RepuestosController.save);
router.delete("/delete/:id", check.auth, RepuestosController.deleteRepuesto);
router.put("/update/:id", check.auth, RepuestosController.update);
router.get("/listall", check.auth, RepuestosController.listAll);
router.get("/listone/:id", check.auth, RepuestosController.listOne);
router.get("/listbyequipo/:id", check.auth, RepuestosController.listbyequipo);
router.get("/listbycuantity", check.auth, RepuestosController.listbyquantity);

// exportar router
module.exports = router;