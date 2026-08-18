// importar dependendias
require("dotenv").config();
const { connection } = require("./db/connection");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const errorHandler = require("./middlewares/errorHandler");

// conexion a bd
console.log("Api Node para Mantenimiento Correcto");
connection ();

// crear servidor node
const app = express();
const port = process.env.PORT || 3900;

// configurar cors
app.use(cors());

// convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); //convierte objeto url a formato js

// cargar conf rutas
const UserRoutes = require("./routes/user"); //ruta usuarios
const EquiposRoutes = require("./routes/equipos"); //ruta equipos 
const TaskRoutes = require("./routes/task"); //ruta tareas
const TaskToDo = require("./routes/tasktodo"); //ruta tareas para hacer
const TaskDone = require("./routes/taskdone"); //ruta tareas realizadas
const Repuesto = require("./routes/repuestos"); //ruta repuestos criticos
const CausaRoutes = require("./routes/causa"); //ruta causa correctivo
const CorrectivoRoutes = require("./routes/mantcorrectivo"); //ruta correctivo
const TaskNotDone = require("./routes/taskNotDone"); // ruta tareas no hechas
const PedidoMant = require("./routes/pedidoMant"); // ruta pedido mantenimiento
const Bitacora = require("./routes/bitacora"); // ruta bitacora
const Pirometria = require("./routes/pirometria"); // ruta pirometria
const PirometriaDone = require("./routes/pirometriaDone"); //ruta pirometriadone
const MovimientoStock = require("./routes/movimientoStock"); // ruta movimientos de stock

app.use("/api/user", UserRoutes);
app.use("/api/equipo", EquiposRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/tasktodo", TaskToDo);
app.use("/api/taskdone", TaskDone);
app.use("/api/repuesto", Repuesto);
app.use("/api/causa", CausaRoutes);
app.use("/api/correctivo", CorrectivoRoutes);
app.use("/api/tasknotdone", TaskNotDone);
app.use("/api/pedidomant", PedidoMant);
app.use("/api/bitacora", Bitacora);
app.use("/api/pirometria", Pirometria);
app.use("/api/pirometriadone", PirometriaDone);
app.use("/api/movimientostock", MovimientoStock);

// ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Gustavo"
        }
    );
} )

// servir las imagenes subidas (esquemas de equipo) desde una carpeta propia,
// independiente del build de React: quedan disponibles al instante, sin
// necesidad de rebuildear el frontend cada vez que se sube una imagen nueva
const uploadsPath = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// servir el build de React (ReactSMCT/dist) para que todo el sistema
// (API + frontend) quede disponible desde un único puerto en la red local
const frontendPath = path.join(__dirname, "ReactSMCT", "dist");
app.use(express.static(frontendPath));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// middleware de errores centralizado (debe ir al final, después de todas las rutas)
app.use(errorHandler);

// poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor de node corriendo en el puerto: ", port);
});