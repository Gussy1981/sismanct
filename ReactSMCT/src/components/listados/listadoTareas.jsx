import { useEffect, useState } from "react";
import { getTask, deleteTask } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import FormTask from "../forms/FormTask";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoTareas = () => {
  const [tasks, setTasks] = useState({});
  const [mode, setMode] = useState("");
  const [taskToModify, setTaskToModify] = useState("");
  const [selection, setSelection] = useState(false);

  const data = async () => {
    try {
      const fetchTasks = await getTask();
      setTasks(fetchTasks);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { data(); }, []);

  const handleChange = (tarea) => { setMode("Edit"); setTaskToModify(tarea); setSelection(true); };
  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };
  const updateTaskList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };

  const handleDelete = (tareaId, task) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar la tarea ${task}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(tareaId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Tarea eliminada!", "", "success"); data(); }
            else Swal.fire("Error", response.data.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar la tarea", "error"));
      }
    });
  };

  const columns = [
    { accessor: "task", title: "Tarea" },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (tarea) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(tarea)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(tarea._id, tarea.task)}>
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="px-3 mb-4">
        {!selection
          ? <button className="btn-success" onClick={handleAdd}>Agregar Tarea</button>
          : <button className="btn-secondary" onClick={handleBack}>Volver</button>}
      </div>
      {mode === "Edit" ? (
        <FormTask mode={mode} task={taskToModify} updateTaskList={updateTaskList} updateOk={updateOk} />
      ) : mode === "Add" ? (
        <FormTask mode={mode} updateTaskList={updateTaskList} />
      ) : (
        <DataTable columns={columns} records={tasks.tarea ?? []} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay tareas registradas" />
      )}
    </>
  );
};

export default listadoTareas;
