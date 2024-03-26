import React, { useEffect, useState } from "react";
import { getTareasPreventivo, deleteTareas, updateFechaConsulta } from "../configuracion/api";
import { Table } from "react-bootstrap";
import FormTaskToDo from "../forms/FormTaskToDo";
import Preventivo from "../layout/public/Preventivo";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument, MdPlayCircle, MdStopCircle} from "react-icons/md";

const listadoPreventivos = () => {
  const [taskToDo, setTaskToDo] = useState([]); //Estado que recibe la petición de la API
  const [selection, setSelection] = useState(false); //Estado para mostrar listado o formulario de edicion
  const [mode, setMode] = useState(""); // Estado para cambiar leyenda de Boton
  const [taskToModify, setTaskToModify] = useState(""); // Estado para enviar la tarea a modificar en el form
  const [menuOption, setMenuOption] = useState("Ver"); //Estado para setear Menu

  const data = async () => {
    const taskToDoData = await getTareasPreventivo();
    console.log(taskToDoData);
    const sortedByEquipo = taskToDoData.tareas.sort((a, b) =>
      a.equipo.localeCompare(b.equipo)
    );
    setTaskToDo({ equipo: sortedByEquipo });
  };

  useEffect(() => {
    data();
  }, []);

  const handleChange = (equipo) => {
    console.log(equipo);
    setSelection(true);
    setMode("Edit");
    setTaskToModify(equipo);
    console.log(menuOption);
  };

  const handleDelete = (equipoId, codigo, tarea) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar la Tarea ${tarea} en el equipo ${codigo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTareas(equipoId)
          .then((response) => {
            if (response.data.status === "Succes") {
              Swal.fire("¡Preventivo eliminado!", "", "success");
              data(); // Actualiza la lista de equipos después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el preventivo",
              "error"
            );
          });
      }
    });
  };

  const updateTaskList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  const handleSetOption = (setter) => {
    setMenuOption(setter);
    setMode("");
  };

  const handleEdit = async (equipoId) => {
    await updateFechaConsulta(equipoId);
    await data();
  }

  const renderContent = () => {
    switch (menuOption) {
      case "Ver":
        return <Preventivo />;
      case "List":
        return !selection ? (
          <div className="pt-4">
            <Table hover variant="dark">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Tarea</th>
                  <th>Encargado</th>
                  <th>Frecuencia</th>
                  <th>Modificar</th>
                  <th>Eliminar</th>
                  <th>Iniciar/Detener</th>
                </tr>
              </thead>
              <tbody>
                {taskToDo.equipo &&
                  taskToDo.equipo.map((equipo) => {
                    return (
                      <tr key={equipo._id}>
                        <td>{equipo.equipo}</td>
                        <td>{equipo.tarea}</td>
                        <td>{equipo.encargado}</td>
                        <td>{equipo.frecuencia}</td>
                        <td>
                          <button
                            className=" text-yellow-600 font-bold h5"
                            onClick={() => handleChange(equipo)}
                          >
                            <MdEditDocument />
                          </button>
                        </td>
                        <td>
                          <button
                            className=" text-purple-600 font-bold h5"
                            onClick={() =>
                              handleDelete(
                                equipo._id,
                                equipo.equipo,
                                equipo.tarea
                              )
                            }
                          >
                            <MdDelete />
                          </button>
                        </td>
                        <td>
                          {equipo.fechaConsulta === null ? (
                            <button
                            className=" text-green-600 font-bold h5"
                            onClick={() => handleEdit(equipo._id)}
                          >
                            <MdPlayCircle />
                          </button>
                          ):(
                            <button
                            className=" text-red-600 font-bold h5"
                            onClick={() => handleEdit(equipo._id)}
                          >
                            <MdStopCircle />
                          </button>
                          )
                          }
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        ) : (
          <FormTaskToDo
            mode={mode}
            taskToModify={taskToModify}
            updateTaskList={updateTaskList}
            updateOk={updateOk}
          />
        );
      case "Add":
        return <FormTaskToDo mode={menuOption} />;
    }
  };

  console.log(taskToDo.equipo);

  return (
    <>
      <div className="flex justify-center items-center text-center h4 py-4">
        Gestión de Mantenimiento Preventivo
      </div>
      <div className="flex text-center space-x-4 pb-4 px-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleSetOption("Ver")}
          disabled={mode === "Edit"}
        >
          Ver Preventivo
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (mode === "Edit") {
              updateOk();
            } else {
              handleSetOption("List");
            }
          }}
        >
          {mode === "Edit" ? "Volver al Listado" : "Modificar Preventivo"}
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleSetOption("Add")}
          disabled={mode === "Edit"}
        >
          Agregar Preventivo
        </button>
      </div>
      {renderContent()};
    </>
  );
};

export default listadoPreventivos;
