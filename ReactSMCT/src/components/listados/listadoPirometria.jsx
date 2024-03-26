import React, { useEffect, useState } from "react";
import {
  getPirometria,
  deletePirometria,
  updateInicioPiro,
} from "../configuracion/api";
import FormAltaPirometria from "../forms/FormAltaPirometria";
import {
  MdDelete,
  MdEditDocument,
  MdPlayCircle,
  MdStopCircle,
} from "react-icons/md";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const listadoPirometria = () => {

  const [pirometrias, setPirometrias] = useState([]);
  const [mode, setMode] = useState("");
  const [piroToModify, setPiroToModify] = useState("");
  const [selection, setSelection] = useState(false);

  const navigate = useNavigate();

  const data = async () => {
    const piroData = await getPirometria();
    console.log(piroData);
    setPirometrias(piroData);
  };

  useEffect(() => {
    data();
  }, []);

  console.log("Estado Modificado", pirometrias);

  const handleAdd = () => {
    setSelection(true);
    setMode("Add");
  };

  const handleList = () =>{
    navigate('/pirometria')
  }
  const handleBack = () => {
    setSelection(false);
    setMode("");
  };

  const handleChange = (pirometria) => {
    console.log("pirometria a modificar", pirometria);
    setMode("Edit");
    setPiroToModify(pirometria);
    setSelection(true);
  };

  const handleDelete = (pirometriaId, codigoEquipo) => {
    console.log("ID a borrar", pirometriaId);
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar el registro de ${codigoEquipo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePirometria(pirometriaId)
          .then((response) => {
            if (response.data.status === "Success") {
              Swal.fire("¡Registro eliminado!", "", "success");
              data(); // Actualiza la lista de equipos después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el registro",
              "error"
            );
          });
      }
    });
  };

  const handleEdit = async (piroId) => {
    await updateInicioPiro(piroId);
    await data();
  };

  const updatePiroList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  return (
    <div>
      {!selection ? (
        <div className=" px-3 ">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={() => handleAdd()}
          >
            Nueva Pirometria
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleList()}
          >
            Ver Registros de Pirometria
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
        <FormAltaPirometria
          mode={mode}
          pirometria={piroToModify}
          updatePiroList={updatePiroList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormAltaPirometria mode={mode} updatePiroList={updatePiroList} />
      ) : (
        <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Rango Temperatura</th>
                <th>Responsable</th>
                <th>Modificar</th>
                <th>Eliminar</th>
                <th>Iniciar / Detener</th>
              </tr>
            </thead>
            <tbody>
              {pirometrias &&
                pirometrias.map((pirometria) => {
                  return (
                    <tr key={pirometria._id}>
                      <td>{pirometria.equipo}</td>
                      <td>{pirometria.temperatura}</td>
                      <td>{pirometria.responsable}</td>
                      <td>
                        <button
                          className=" text-yellow-600 font-bold h5"
                          onClick={() => handleChange(pirometria)}
                        >
                          <MdEditDocument />
                        </button>
                      </td>
                      <td>
                        <button
                          className=" text-purple-600 font-bold h5"
                          onClick={() =>
                            handleDelete(pirometria._id, pirometria.equipo)
                          }
                        >
                          <MdDelete />
                        </button>
                      </td>
                      <td>
                        {!pirometria.inicio ? (
                          <button
                            className=" text-green-600 font-bold h5"
                            onClick={() => handleEdit(pirometria._id)}
                          >
                            <MdPlayCircle />
                          </button>
                        ) : (
                          <button
                            className=" text-red-600 font-bold h5"
                            onClick={() => handleEdit(pirometria._id)}
                          >
                            <MdStopCircle />
                          </button>
                        )}
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

export default listadoPirometria;
