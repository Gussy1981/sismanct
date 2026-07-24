const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const registerRules = [
    body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("dni").trim().notEmpty().withMessage("El DNI es obligatorio"),
    body("surname").trim().notEmpty().withMessage("El apellido es obligatorio"),
    body("role").isIn(["Empleado", "Administrador"]).withMessage("Rol inválido"),
];

const loginRules = [
    body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("dni").trim().notEmpty().withMessage("El DNI es obligatorio"),
];

//defino rutas
router.get("/prueba-usuario", check.auth, UserController.pruebaUser);
router.post("/register", registerRules, validate, UserController.register);
router.post("/login", loginRules, validate, UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/listall", check.auth, UserController.listAll);
router.put("/update/:id", check.auth, UserController.update);
router.delete("/delete/:id", check.auth, UserController.deleteUser);


// exportar router
module.exports = router;