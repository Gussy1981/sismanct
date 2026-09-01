import { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import { Global } from "../../helpers/Global";
import { formatDateOnly } from "../../helpers/dateOnly";

const TareasNoCumplidas = ({ tareas, onComplete }) => {
  const [noTareas, setNoTareas] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setNoTareas(tareas);
    Swal.fire({
      title: "Tienes tareas no cumplidas, debes justificar los motivos",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }, [tareas]);

  if (noTareas.length === 0) {
    Swal.fire("Gracias", "Justificaste todas las tareas", "success").then(() => {
      onComplete([]);
    });
  }

  const handleButtonClick = (tarea) => {
    Swal.fire({
      title: "¿Por qué no realizaste la tarea?",
      html:
        '<select id="razon" class="swal2-select">' +
        '<option value="No tuve tiempo">No tuve tiempo</option>' +
        '<option value="Me olvide">Me olvidé</option>' +
        '<option value="No tenia herramientas">No tenía herramientas</option>' +
        '<option value="Necesitaba repuestos que no habia">Necesitaba repuestos que no había</option>' +
        '<option value="No era prioridad">No era prioridad</option>' +
        "</select>",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const motivo = document.getElementById("razon").value;
        if (!motivo) Swal.showValidationMessage("Debes ingresar un motivo");
        return { motivo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(Global.url + `tasknotdone/update/${tarea._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ motivo: result.value.motivo, motivoEstado: true }),
        })
          .then((res) => res.json())
          .then(() => setNoTareas((prev) => prev.filter((t) => t._id !== tarea._id)))
          .catch(console.log);
      }
    });
  };

  const columns = [
    { accessor: "task.equipo",    title: "Equipo" },
    { accessor: "task.tarea",     title: "Descripción" },
    { accessor: "task.frecuencia", title: "Frecuencia" },
    {
      accessor: "fechaDone", title: "Fecha",
      render: ({ fechaDone }) => formatDateOnly(fechaDone),
    },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (tarea) => (
        <button className="btn-success text-xs py-1 px-3" onClick={() => handleButtonClick(tarea)}>
          Ingresar motivo
        </button>
      ),
    },
  ];

  return (
    <>
      <p className="text-lg font-semibold text-center mb-4 uppercase tracking-wide text-orange-400">
        Tareas no cumplidas
      </p>
      <DataTable columns={columns} records={noTareas} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="Sin tareas pendientes" />
    </>
  );
};

export default TareasNoCumplidas;
