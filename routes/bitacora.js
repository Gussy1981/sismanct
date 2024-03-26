const express = require("express");
const router = express.Router();
const BitacoraController = require("../controllers/bitacora");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", check.auth, BitacoraController.save);
router.get("/listbyid/:id", check.auth, BitacoraController.listById);
router.put("/update/:id", check.auth, BitacoraController.update);
router.get("/listall", check.auth, BitacoraController.listAll);
router.delete("/delete/:id", check.auth, BitacoraController.deleteBitacora);

// exportar router
module.exports = router;