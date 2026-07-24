import { useEffect, useState } from "react";
import { getTareasByEquipo, getTaskNotDone } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import TareasNoCumplidas from "./TareasNoCumplidas";

const TareasByEquipo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user.role;
  const userName = user.name;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tareas, setTareas] = useState([]);
  const [noTareas, setNoTareas] = useState([]);

  useEffect(() => {
    const data = async () => {
      try {
        const tareasData = await getTareasByEquipo(id);
        if (tareasData.message === "No hay Tareas programadas") {
          setTareas([]);
        } else {
          setTareas(tareasData.tasks.sort((a, b) => a.frecuencia.localeCompare(b.frecuencia)));
        }
      } catch (error) { console.log(error); }
    };
    data();
    const interval = setInterval(data, 600000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const dataNoTask = async () => {
      try {
        const noTareasData = await getTaskNotDone(userName);
        setNoTareas(noTareasData.newData);
      } catch (error) { console.log(error); }
    };
    dataNoTask();
  }, [userName]);

  const handleButtonClick = (tarea) => {
    Swal.fire({
      title: "¿Cuántos minutos te llevó la tarea?",
      html:
        '<label for="tiempo">Minutos:</label>' +
        '<input id="tiempo" type="number" min="1" step="1" class="swal2-input">' +
        '<label for="comentarios">Comentarios:</label>' +
        '<textarea id="comentarios" class="swal2-textarea"></textarea>',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const time = document.getElementById("tiempo").value;
        const comentarios = document.getElementById("comentarios").value;
        fetch(Global.url + `tasktodo/cumplirtarea/${tarea._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ tiempo: time, comentarios, encargado: tarea.encargado, ejecutante: userName }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "Error") {
              Swal.fire("Atención", data.message, "warning");
            } else {
              setTareas((prev) => prev.filter((t) => t._id !== tarea._id));
            }
          })
          .catch(console.log);
      }
    });
  };

  const handleButtonVolver = () => {
    navigate(userRole === "Empleado" ? "/preventivo" : "/admin/preventivo");
  };

  const handleJustifiedTasks = (noTareasCompletadas) => setNoTareas(noTareasCompletadas);

  const columns = [
    { accessor: "tarea",     title: "Descripción" },
    { accessor: "frecuencia", title: "Frecuencia" },
    { accessor: "encargado", title: "Encargado" },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (tarea) => (
        <button className="btn-success text-xs py-1 px-3" onClick={() => handleButtonClick(tarea)}>
          Cumplir tarea
        </button>
      ),
    },
  ];

  if (tareas.length === 0) {
    return (
      <div className="flex justify-center pt-10">
        <p className="text-zinc-400 text-lg">No hay tareas programadas para hoy</p>
      </div>
    );
  }

  return (
    <>
      {noTareas.length > 0 ? (
        <TareasNoCumplidas tareas={noTareas} onComplete={handleJustifiedTasks} />
      ) : (
        <>
          <p className="text-lg font-semibold text-center mb-2 uppercase tracking-wide">
            Mantenimiento Preventivo
          </p>
          {tareas.length > 0 && (
            <p className="text-center text-orange-400 mb-4">Equipo: {tareas[0].equipo}</p>
          )}
          <DataTable columns={columns} records={tareas} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay tareas para hoy" />
          <div className="flex justify-center pt-4">
            <button className="btn-secondary" onClick={handleButtonVolver}>
              Volver a pantalla principal
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TareasByEquipo;
