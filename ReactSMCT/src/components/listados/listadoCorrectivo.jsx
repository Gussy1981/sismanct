import React, { useEffect, useState, useRef } from "react";
import { getCorrectivo, deleteCorrectivo } from "../configuracion/api";
import FormCorrectivo from "../forms/FormMantCorrectivo";
import CorrectivoOffcanvas from "../correctivo/CorrectivoOffcanvas";
import { DateTime } from "luxon";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument, MdFormatLineSpacing } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import ExportToExcel from "../ExportToExcel/ExportToExcel";


const listadoCorrectivo = ({ pedido }) => {
  const [correctivos, setCorrectivos] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [repuestoSelect, setRepuestoSelect] = useState(false);
  const [mode, setMode] = useState(""); //Manejo el estado del formulario
  const [correctivoToModify, setCorrectivoToModify] = useState(""); //Seteo el ID del correctivo para modificar
  const [selection, setSelection] = useState(false);
  const [pedidoMant, setPedidoMant] = useState();
  const [sortOrder, setSortOrder] = useState("asc"); // Puede ser "asc" o "desc"
  const [sortColumn, setSortColumn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

  console.log("Veo pedido desde listadoCorrectivo", pedido);

  const fetchData = async (searchTerm) => {
    try {
      setLoading(true);

      // Si la búsqueda está vacía, obtenemos todos los correctivos
      const response = searchTerm ? await getCorrectivo(searchTerm) : await getCorrectivo();
      setCorrectivos(response);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los correctivos", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setPedidoMant(pedido);
    if (pedidoMant) {
      setMode("Add");
    }
    console.log("Desde useEffect", pedidoMant);
  }, [pedidoMant]);

  console.log("Estado pedidoMant", pedidoMant);

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      // Si la columna ya está ordenada, cambia el orden.
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es una nueva columna, ordénala en ascendente.
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedCorrectivos = [...correctivos]; // Clonamos la lista de correctivos
  if (sortColumn) {
    sortedCorrectivos.sort((a, b) => {
      // Comparar los valores de la columna seleccionada
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (sortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  const handleShowOffcanvas = (repuesto) => {
    setShowOffcanvas(true);
    setRepuestoSelect(repuesto);
  };

  const handleChange = (option) => {
    setMode("Edit");
    setCorrectivoToModify(option);
    setSelection(true);
  };
  const handleDelete = (optionId, motivo, equipo) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar ${motivo} en ${equipo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCorrectivo(optionId)
          .then((response) => {
            if (response.data.status === "Succes") {
              Swal.fire("¡Correctivo eliminado!", "", "success");
              fetchData(); // Actualiza la lista de equipos después de la eliminación
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

  const handleAdd = () => {
    setSelection(true);
    setMode("Add");
  };

  const handleBack = () => {
    setSelection(false);
    setMode("");
  };

  const updateCorrectivoList = () => {
    fetchData();
  };

  const updateOk = () => {
    setSelection(false);
    setMode("");
  };

  return (
    <>
      {!selection ? (
        <div className="flex text-center space-x-4 pb-4 px-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAdd()}
          >
            Alta Correctivo
          </button>
          <ExportToExcel tableRef={tableRef} filename="Tabla Correctivo" sheet="Correctivo"/>
        </div>
      ) : (
        <div className="flex text-center space-x-4 pb-4 px-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleBack()}
          >
            Volver
          </button>
        </div>
      )}
      {mode === "Edit" ? (
        <FormCorrectivo
          mode={mode}
          option={correctivoToModify}
          updateList={updateCorrectivoList}
          updateOk={updateOk}
        />
      ) : mode === "Add" ? (
        <FormCorrectivo
          mode={mode}
          pedidoMant={pedidoMant}
          updateList={updateCorrectivoList}
          updateOk={updateOk}
        />
      ) : (
        <>
        <div className="pb-2 pl-3 flex items-center">
      <h1 className="mr-2 text-xl text-orange-500">Buscador:</h1>
      <input
          type="text"
          placeholder="Ingrese el texto de busqueda"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" text-white w-[30%] bg-slate-600 rounded pl-2"
        />
        </div>
        <div className="pt-2">
          <Table ref={tableRef} hover variant="dark">
            <thead>
              <tr>
              <th
                className="flex items-center justify-center"
                onClick={() => handleSort("fecha")}
              >
                <span className="mr-2 cursor-pointer">Fecha</span>
                <MdFormatLineSpacing />
              </th>
                <th>Equipo</th>
                <th>Solicitante</th>
                <th>Motivo</th>
                <th
                className="flex items-center justify-center"
                onClick={() => handleSort("tareas")}
              >
                <span className="mr-2 cursor-pointer">Tarea</span>
                <MdFormatLineSpacing />
              </th>
                <th>Repuestos</th>
                <th className=" hidden ">Repuestos Utilizados</th>
                <th>Responsables</th>
                <th>Tiempo</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
            {sortedCorrectivos &&
              sortedCorrectivos.map((option) => {
                  const fechaFormateada = DateTime.fromISO(
                    option.fecha
                  ).toFormat("dd-MM-yyyy");
                  return (
                    <tr key={option._id}>
                      <td>{fechaFormateada}</td>
                      <td>{option.equipo}</td>
                      <td>{option.solicitante}</td>
                      <td>{option.motivo}</td>
                      <td>{option.tareas}</td>
                      <td>
                        {option.repuestosUtilizados.length > 0 && (
                          <button
                            className=" text-blue-600 font-bold h5"
                            onClick={() =>
                              handleShowOffcanvas(option.repuestosUtilizados)
                            }
                          >
                            <FcViewDetails />
                          </button>
                        )}
                      </td>
                      <td className="hidden">
                        {option.repuestosUtilizados.map((repuesto, index) => (
                          <div key={index}>
                            <div>Nombre: {repuesto.id_repuesto.nombre}</div>
                            <div>Marca: {repuesto.id_repuesto.marca}</div>
                            <div>Cantidad: {repuesto.cantidad}</div>
                            <div>
                              Precio Individual: {repuesto.id_repuesto.precio}
                            </div>
                            <div>
                              Subtotal:{" "}
                              {repuesto.cantidad * repuesto.id_repuesto.precio}
                            </div>
                          </div>
                        ))}
                      </td>
                      <td>{option.responsables.join(", ")}</td>
                      <td>{option.tiempo}</td>
                      <td>
                        <button
                          className=" text-yellow-600 font-bold h5"
                          onClick={() => handleChange(option)}
                        >
                          <MdEditDocument />
                        </button>
                      </td>
                      <td>
                        <button
                          className=" text-red-600 font-bold h5"
                          onClick={() =>
                            handleDelete(
                              option._id,
                              option.motivo,
                              option.equipo
                            )
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
        </>
      )}

      <CorrectivoOffcanvas
        show={showOffcanvas}
        handleCloseOffcanvas={handleCloseOffcanvas}
        repuestoSelect={repuestoSelect}
      />
    </>
  );
};

export default listadoCorrectivo;
