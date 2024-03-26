import React, { useEffect, useMemo, useState } from "react";
import { getOneEquipo, getPiroDone } from "../configuracion/api";
import { Table } from "react-bootstrap";
import { MdArchive } from "react-icons/md";
import exportToPDF from "../ExportToPDF/exportToPDF";
import { DateTime } from "luxon";

const listadoPirometriaDone = () => {
  const [piroDone, setPiroDone] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const data = async () => {
    const response = await getPiroDone();
    //verificar si los datos son un array antes de filtrar
    if (Array.isArray(response.registros)) {
      const data = response.registros;
      //filtro los registros que no tienen la propiedad resultado como null
      const registros = data.filter((registros) => registros.resultado);
      console.log(registros);
      setPiroDone(registros);
    } else {
      console.error("Los datos no son un array");
    }
  };

  useEffect(() => {
    data();
  }, []);

  const handleExportToPDF = async (item) => {
    const equipoInfoArray = await getOneEquipo(item.equipo);
    const equipoInfo = equipoInfoArray.equipo[0];
    exportToPDF(item, equipoInfo);
  };
  console.log("Listado PiroDone", piroDone);

  const filteredRecords = useMemo(
    () =>
      piroDone.filter((item) =>
        item.equipo.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [piroDone, searchTerm]
  );

  return (
    <>
      <div className="pb-2 pl-3 pt-4 flex items-center">
      <h1 className="mr-2 text-xl text-orange-500">Buscador por equipo:</h1>
      <input
          type="text"
          placeholder="Ingrese el equipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" text-white w-[30%] bg-slate-600 rounded pl-2"
        />
        </div>
      <div className="pt-2">
        <Table hover variant="dark">
          <thead>
            <tr>
              <td>Equipo</td>
              <td>Fecha</td>
              <td>Responsable</td>
              <td>Resultado</td>
              <td>Descargar registro</td>
            </tr>
          </thead>
          <tbody>
            {filteredRecords &&
              filteredRecords.map((item) => {
                const fechaFormateada = DateTime.fromISO(
                  item.fechaControl
                ).toFormat("dd-MM-yyyy");
                return (
                  <tr key={item._id}>
                    <td>{item.equipo}</td>
                    <td>{fechaFormateada}</td>
                    <td>{item.responsable}</td>
                    <td>{item.resultado}</td>
                    <td>
                      <button
                        className=" text-yellow-600 font-bold h5"
                        onClick={() => handleExportToPDF(item)}
                      >
                        <MdArchive />
                      </button>
                    </td>
                  </tr>
                );
              })}
            <tr></tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default listadoPirometriaDone;
