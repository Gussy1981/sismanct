const express = require("express");
const router = express.Router();
const EquiposController = require("../controllers/equipos");
const check = require("../middlewares/auth");
const multer = require("multer");

//Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./reactsmct/public/");
  },
  filename: (req, file, cb) => {
    cb(null, "esquema-" + file.originalname);
  },
});

const uploads = multer({ storage });

//defino rutas
router.post("/save", [check.auth, uploads.single("file0")], EquiposController.save);
router.delete("/delete/:id", check.auth, EquiposController.deleteEquipo);
router.put("/update/:id", check.auth, EquiposController.update);
router.get("/listall", check.auth, EquiposController.listAll);
router.get("/listone/:codigo", check.auth, EquiposController.listOne);
router.get(
  "/lisbyclass/:clasificacion",
  check.auth,
  EquiposController.listByClass
);
router.post(
  "/updateimage/:id",
  [check.auth, uploads.single("file0")],
  EquiposController.updateImage
);

// exportar router
module.exports = router;
