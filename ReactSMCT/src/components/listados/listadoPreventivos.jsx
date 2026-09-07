import { useEffect, useState } from "react";
import { getTareasPreventivo, deleteTareas, updateFechaConsulta } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import FormTaskToDo from "../forms/FormTaskToDo";
import Preventivo from "../layout/public/Preventivo";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument, MdPlayCircle, MdStopCircle } from "react-icons/md";

const MESES_CORTOS = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const frecuenciaLabel = (t) =>
  ["Trimestral", "Semestral", "Anual"].includes(t.frecuencia) && t.mesAncla
    ? `${t.frecuencia} · ${MESES_CORTOS[t.mesAncla]}`
    : t.frecuencia;

const listadoPreventivos = () => {
  const [taskToDo, setTaskToDo] = useState([]);
  const [selection, setSelection] = useState(false);
  const [mode, setMode] = useState("");
  const [taskToModify, setTaskToModify] = useState("");
  const [menuOption, setMenuOption] = useState("Ver");

  const data = async () => {
    const taskToDoData = await getTareasPreventivo();
    const sorted = taskToDoData.tareas.sort((a, b) => a.equipo.localeCompare(b.equipo));
    setTaskToDo(sorted);
  };

  useEffect(() => { data(); }, []);

  const handleChange = (equipo) => { setSelection(true); setMode("Edit"); setTaskToModify(equipo); };
  const updateTaskList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };
  const handleSetOption = (setter) => { setMenuOption(setter); setMode(""); };
  const handleEdit = async (equipoId) => { await updateFechaConsulta(equipoId); await data(); };

  const handleDelete = (equipoId, codigo, tarea) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar la tarea ${tarea} del equipo ${codigo}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTareas(equipoId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Preventivo eliminado!", "", "success"); data(); }
            else Swal.fire("Error", response.data.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el preventivo", "error"));
      }
    });
  };

  const columns = [
    { accessor: "equipo",    title: "Equipo" },
    { accessor: "tarea",     title: "Tarea" },
    { accessor: "encargado", title: "Encargado" },
    { accessor: "frecuencia", title: "Frecuencia", render: (t) => frecuenciaLabel(t) },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (equipo) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(equipo)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(equipo._id, equipo.equipo, equipo.tarea)}>
            <MdDelete />
          </button>
          {equipo.fechaConsulta === null ? (
            <button className="text-green-500 hover:text-green-400 text-xl transition-colors" title="Iniciar" onClick={() => handleEdit(equipo._id)}>
              <MdPlayCircle />
            </button>
          ) : (
            <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Detener" onClick={() => handleEdit(equipo._id)}>
              <MdStopCircle />
            </button>
          )}
        </div>
      ),
    },
  ];

  const renderContent = () => {
    switch (menuOption) {
      case "Ver":
        return <Preventivo />;
      case "List":
        return !selection ? (
          <DataTable columns={columns} records={taskToDo} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay tareas preventivas registradas" />
        ) : (
          <FormTaskToDo mode={mode} taskToModify={taskToModify} updateTaskList={updateTaskList} updateOk={updateOk} />
        );
      case "Add":
        return <FormTaskToDo mode={menuOption} updateTaskList={updateTaskList} />;
    }
  };

  return (
    <>
      <p className="flex justify-center items-center text-center font-semibold text-lg py-4">
        Gestión de Mantenimiento Preventivo
      </p>
      <div className="flex gap-3 pb-4 px-3">
        <button className="btn-primary" onClick={() => handleSetOption("Ver")} disabled={mode === "Edit"}>
          Ver Preventivo
        </button>
        <button className="btn-secondary" onClick={() => { if (mode === "Edit") updateOk(); else handleSetOption("List"); }}>
          {mode === "Edit" ? "Volver al Listado" : "Modificar Preventivo"}
        </button>
        <button className="btn-success" onClick={() => handleSetOption("Add")} disabled={mode === "Edit"}>
          Agregar Preventivo
        </button>
      </div>
      {renderContent()}
    </>
  );
};

export default listadoPreventivos;
