import React, { useState, useEffect } from "react";
import { getEquipos } from "../configuracion/api";
import { Table } from "react-bootstrap";
import { deleteEquipo } from "../configuracion/api";
import Swal from "sweetalert2";
import FormEquipos from "../forms/FormEquipos";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [mode, setMode] = useState(""); // estado para manejar el modo del formulario
  const [equipoToModify, setEquipoToModify] = useState(""); // estado que toma el valor de equipoID para luego pasarlo al form
  const [selection, setSelection] = useState(false);

  const handleAdd = () => {
    setSelection(true);
    setMode("Add");
  };

  const handleBack = () => {
    setSelection(false);
    setMode("");
  };

  const data = async () => {
    const equiposData = await getEquipos();
    const sortedByCodigo = equiposData.equipo.sort((a, b) =>
      a.codigo.localeCompare(b.codigo)
    );
    setEquipos({ equipo: sortedByCodigo });
  };

  useEffect(() => {
    data();
  }, []);

  console.log(equipos);

  const handleChange = (equipo) => {
    setMode("Edit");
    setEquipoToModify(equipo);
    setSelection(true);
  };

  const updateEquipoList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  const handleDelete = (equipoId, codigoEquipo) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar a ${codigoEquipo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEquipo(equipoId)
          .then((response) => {
            if (response.data.status === "Succes") {
              Swal.fire("¡Equipo eliminado!", "", "success");
              data(); // Actualiza la lista de equipos después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el equipo",
              "error"
            );
          });
      }
    });
  };

  return (
    <div>
      {!selection ? (
        <div className=" px-3 ">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAdd()}
          >
            Agregar Equipo
          </button>
        </div>
      ) : (
        <div className=" px-3 ">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleBack()}
          >
            Volver
          </button>
        </div>
      )}
      {mode === "Edit" ? (
        <FormEquipos
          mode={mode}
          equipo={equipoToModify}
          updateEquipoList={updateEquipoList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormEquipos mode={mode} updateEquipoList={updateEquipoList} />
      ) : (
        <div className="pt-4">
        <Table hover variant="dark">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Codigo</th>
                <th>Clasificación</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {equipos.equipo &&
                equipos.equipo.map((equipo) => {
                  return (
                    <tr key={equipo._id}>
                      <td>{equipo.tipo}</td>
                      <td>{equipo.codigo}</td>
                      <td>{equipo.clasificacion}</td>
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
                          className=" text-red-600 font-bold h5"
                          onClick={() =>
                            handleDelete(equipo._id, equipo.codigo)
                          }
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
        </Table>
        </div>
      )}
    </div>
  );
};

export default listadoEquipos;
