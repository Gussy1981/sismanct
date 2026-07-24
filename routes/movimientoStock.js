const express = require("express");
const router = express.Router();
const MovimientoController = require("../controllers/movimientoStock");
const check = require("../middlewares/auth");

router.get("/listall", check.auth, MovimientoController.listAll);
router.get("/kpi-criticos", check.auth, MovimientoController.kpiCriticos);

module.exports = router;
