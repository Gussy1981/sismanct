const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const CorrectivoController = require("../controllers/mantcorrectivo");
const check = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const correcitivoRules = [
    body("equipo").trim().notEmpty().withMessage("El equipo es obligatorio"),
    body("solicitante").trim().notEmpty().withMessage("El solicitante es obligatorio"),
    body("motivo").trim().notEmpty().withMessage("El motivo es obligatorio"),
    body("tareas").trim().notEmpty().withMessage("La descripción de tareas es obligatoria"),
    body("tiempo").isFloat({ min: 0 }).withMessage("El tiempo debe ser un número positivo"),
    body("repuestosUtilizados").isArray().withMessage("Los repuestos deben ser un array"),
    body("repuestosUtilizados.*.cantidad")
        .isInt({ min: 1 })
        .withMessage("La cantidad de cada repuesto debe ser >= 1"),
];

//defino rutas
router.post("/save", correcitivoRules, validate, CorrectivoController.save);
router.get("/kpis", check.auth, CorrectivoController.getKPIs);
router.delete("/delete/:id", check.auth, CorrectivoController.deleteCorrectivo);
router.put("/update/:id", check.auth, CorrectivoController.update);
router.get("/findByMotivo/:id", check.auth, CorrectivoController.findByMotivo);
router.get("/findMotivoByEquipo/:equipoId/:motivoId", check.auth, CorrectivoController.findMotivoByEquipo);
router.get("/listall", CorrectivoController.listAll);

// exportar router
module.exports = router;