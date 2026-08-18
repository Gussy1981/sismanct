const express = require("express");
const router = express.Router();
const EquiposController = require("../controllers/equipos");
const check = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

//Configuracion de subida: se guarda en /uploads (fuera del build de React) para
//que las imagenes queden disponibles al instante en producción, sin necesidad
//de rebuildear el frontend cada vez que se sube o reemplaza una imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
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
