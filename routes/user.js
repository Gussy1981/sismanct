const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

//defino rutas
router.get("/prueba-usuario", check.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/listall", check.auth, UserController.listAll);
router.put("/update/:id", check.auth, UserController.update);
router.delete("/delete/:id", check.auth, UserController.deleteUser);


// exportar router
module.exports = router;