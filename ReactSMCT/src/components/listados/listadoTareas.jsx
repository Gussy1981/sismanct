import React, { useEffect, useState } from "react";
import { getTask, deleteTask } from "../configuracion/api";
import { Table } from "react-bootstrap";
import FormTask from "../forms/FormTask";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoTareas = () => {
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState(""); // estado para manejar el modo del formulario
  const [taskToModify, setTaskToModify] = useState(""); // estado que toma el valor de equipoID para luego pasarlo al form
  const [selection, setSelection] = useState(false);

  const data = async () => {
    try {
      const fetchTasks = await getTask();
      console.log(fetchTasks);
      setTasks(fetchTasks);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    data();
  }, []);

  const handleChange = (tarea) => {
    console.log("Tarea a Modificar", tarea);
    setMode("Edit");
    setTaskToModify(tarea);
    setSelection(true);
  };

  const handleDelete = (tareaId, task) => {
    console.log("TareaID", tareaId + "Task", task);
    Swal.fire({
        title: `¿Estás seguro que quieres eliminar la tarea ${task}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTask(tareaId)
            .then((response) => {
              if (response.data.status === "Succes") {
                Swal.fire("¡Tarea eliminada!", "", "success");
                data(); // Actualiza la lista de equipos después de la eliminación
              } else {
                Swal.fire("Error", response.message, "error");
              }
            })
            .catch((error) => {
              console.error(error);
              Swal.fire("Error", "Hubo un problema al eliminar la tarea", "error");
            });
        }
      });
  };

  const handleAdd = () =>{
    setSelection(true);
    setMode("Add");
  }

  const handleBack = () =>{
    setSelection(false);
    setMode("");
  }

  const updateTaskList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  }

  return (
    <>
      {!selection ? (
        <div className=" px-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleAdd()}
        >
          Agregar Tarea
        </button>
        </div>
      ) : (
        <div className=" px-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleBack()}
        >
          Volver
        </button>
        </div>
      )}
      {mode === "Edit" ? (
        <FormTask
          mode={mode}
          task={taskToModify}
          updateTaskList={updateTaskList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormTask mode={mode} updateTaskList={updateTaskList} />
      ) : (
        <div className="pt-4">
        <Table hover variant="dark">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tasks.tarea &&
              tasks.tarea.map((tarea) => {
                return (
                  <tr key={tarea._id}>
                    <td>{tarea.task}</td>
                    <td>
                      <button
                        className=" text-yellow-600 font-bold h5"
                        onClick={() => handleChange(tarea)}
                      >
                        <MdEditDocument/>
                      </button>
                    </td>
                    <td>
                      <button
                        className=" text-red-600 font-bold h5"
                        onClick={() => handleDelete(tarea._id, tarea.task)}
                      >
                        <MdDelete/>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        </div>
      )}
    </>
  );
};

export default listadoTareas;
