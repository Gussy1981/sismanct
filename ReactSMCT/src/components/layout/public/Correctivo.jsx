import React, { useEffect, useState } from "react";
import { getCorrectivo } from "../../configuracion/api";
import { DateTime } from "luxon";
import { Table } from "react-bootstrap";
import { MdFormatLineSpacing } from "react-icons/md";

const Correctivo = () => {
  const [correctivos, setCorrectivos] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Puede ser "asc" o "desc"
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

  console.log(correctivos);

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

  return (
    <>
      <h1 className="text-center h4 p-2">Mantenimiento Correctivo</h1>
      <div className="pt-2">
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
        {loading ? (
          <p>Cargando...</p>
        ) : (
        <Table hover variant="dark">
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
              <th>Responsables</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {sortedCorrectivos &&
              sortedCorrectivos.map((option) => {
                const fechaFormateada = DateTime.fromISO(option.fecha).toFormat(
                  "dd-MM-yyyy"
                );
                return (
                  <tr key={option._id}>
                    <td>{fechaFormateada}</td>
                    <td>{option.equipo}</td>
                    <td>{option.solicitante}</td>
                    <td>{option.motivo}</td>
                    <td>{option.tareas}</td>
                    <td>{option.responsables.join(", ")}</td>
                    <td>{option.tiempo}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        )}
      </div>
    </>
  );
};

export default Correctivo;
