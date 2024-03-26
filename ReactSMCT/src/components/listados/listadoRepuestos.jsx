import React, { useEffect, useState } from "react";
import { getRepuesto, deleteRepuesto } from "../configuracion/api";
import FormRepuesto from "../forms/FormRepuestos";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoRepuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [mode, setMode] = useState(""); // estado para manejar el modo del formulario
  const [repuestoToModify, setRepuestoToModify] = useState(""); // estado que toma el valor de repuestoID para luego pasarlo al form
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
    const repuestosData = await getRepuesto();
    const sortedByCodigo = repuestosData.repuesto.sort((a, b) =>
      a.equipo.localeCompare(b.equipo)
    );
    setRepuestos({ repuesto: sortedByCodigo });
  };

  useEffect(() => {
    data();
  }, []);

  console.log(repuestos);

  const handleChange = (repuesto) => {
    setMode("Edit");
    setRepuestoToModify(repuesto);
    setSelection(true);
  };

  const updateRepuestoList = () => {
    data();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  const handleDelete = (repuestoId, nombreRepuesto) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar a ${nombreRepuesto}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRepuesto(repuestoId)
          .then((response) => {
            if (response.data.status === "Succes") {
              Swal.fire("¡Repuesto eliminado!", "", "success");
              data(); // Actualiza la lista de repuestos después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el repuesto",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      {!selection ? (
        <div className=" px-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAdd()}
          >
            Agregar Repuesto
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
        <FormRepuesto
          mode={mode}
          repuesto={repuestoToModify}
          updateRepuestoList={updateRepuestoList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormRepuesto mode={mode} updateRepuestoList={updateRepuestoList} />
      ) : (
        <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Tipo</th>
                <th>Otras Caracteristicas</th>
                <th>Cantidad</th>
                <th>Stock Min</th>
                <th>Precio</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {repuestos.repuesto &&
                repuestos.repuesto.map((repuesto) => {
                  return (
                    <tr key={repuesto._id}>
                      <td>{repuesto.equipo}</td>
                      <td>{repuesto.nombre}</td>
                      <td>{repuesto.marca}</td>
                      <td>{repuesto.tipo}</td>
                      <td>{repuesto.otras}</td>
                      <td>{repuesto.cantidad}</td>
                      <td>{repuesto.minStock}</td>
                      <td>{repuesto.precio}</td>
                      <td>
                        <button
                          className=" text-yellow-600 font-bold h5"
                          onClick={() => handleChange(repuesto)}
                        >
                          <MdEditDocument />
                        </button>
                      </td>
                      <td>
                        <button
                          className=" text-red-600 font-bold h5"
                          onClick={() =>
                            handleDelete(repuesto._id, repuesto.nombre)
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
      ;
    </>
  );
};

export default listadoRepuestos;
