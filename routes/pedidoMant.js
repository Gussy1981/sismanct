const express = require("express");
const router = express.Router();
const PedidosMantController = require("../controllers/pedidoMant");
const check = require("../middlewares/auth");

//defino rutas
router.post("/save", PedidosMantController.save);
router.delete("/delete/:id", check.auth, PedidosMantController.deletePedido);
router.put("/update/:id", check.auth, PedidosMantController.update);
router.get("/listall",  PedidosMantController.listAll);
router.get("/listnotdone", PedidosMantController.listByCumplido);

// exportar router
module.exports = router;