const express = require("express");
const router = express.Router();
const CausaController = require("../controllers/causa");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", check.auth, CausaController.save);
router.delete("/delete/:id", check.auth, CausaController.deleteCausa);
router.put("/update/:id", check.auth, CausaController.update);
router.get("/listall", check.auth, CausaController.listAll);
router.get("/listone/:id", check.auth, CausaController.listOne);

// exportar router
module.exports = router;