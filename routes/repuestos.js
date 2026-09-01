const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const RepuestosController = require("../controllers/repuestos");
const check = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const repuestoRules = [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("unidadStock").isIn(["Unidad", "Grs", "Kgs"]).withMessage("La unidad de stock no es válida"),
    body("cantidad").isFloat({ min: 0 }).withMessage("La cantidad debe ser un número >= 0")
        .custom((value, { req }) => req.body.unidadStock !== "Unidad" || Number.isInteger(Number(value)))
        .withMessage("La cantidad debe ser entera cuando el stock se administra por unidad"),
    body("minStock").isFloat({ gt: 0 }).withMessage("El stock mínimo debe ser mayor que 0")
        .custom((value, { req }) => req.body.unidadStock !== "Unidad" || Number.isInteger(Number(value)))
        .withMessage("El stock mínimo debe ser entero cuando se administra por unidad"),
    body("precio").optional().isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
];

//defino rutas
router.post("/save", check.auth, repuestoRules, validate, RepuestosController.save);
router.delete("/delete/:id", check.auth, RepuestosController.deleteRepuesto);
router.put("/update/:id", check.auth, repuestoRules, validate, RepuestosController.update);
router.get("/listall", check.auth, RepuestosController.listAll);
router.get("/listone/:id", check.auth, RepuestosController.listOne);
router.get("/listbyequipo/:id", check.auth, RepuestosController.listbyequipo);
router.get("/listbycuantity", check.auth, RepuestosController.listbyquantity);

// exportar router
module.exports = router;
