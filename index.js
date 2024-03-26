// importar dependendias
const { connection } = require("./db/connection");
const express = require("express");
const cors = require("cors");

// conexion a bd
console.log("Api Node para Mantenimiento Correcto");
connection ();

// crear servidor node
const app = express();
const port = 3900;

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

// ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Gustavo"
        }
    );
} )

// poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor de node corriendo en el puerto: ", port);
});