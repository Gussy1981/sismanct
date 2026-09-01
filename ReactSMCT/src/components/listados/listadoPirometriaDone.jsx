import { useEffect, useMemo, useState } from "react";
import { getOneEquipo, getPiroDone } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import { MdArchive } from "react-icons/md";
import exportToPDF from "../ExportToPDF/exportToPDF";
import { DateTime } from "luxon";
import { ARGENTINA_TIME_ZONE } from "../../helpers/dateOnly";

const listadoPirometriaDone = () => {
  const [piroDone, setPiroDone] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const data = async () => {
    const response = await getPiroDone();
    if (Array.isArray(response.registros)) {
      setPiroDone(response.registros.filter((r) => r.resultado));
    }
  };

  useEffect(() => { data(); }, []);

  const handleExportToPDF = async (item) => {
    const equipoInfoArray = await getOneEquipo(item.equipo);
    exportToPDF(item, equipoInfoArray.equipo[0]);
  };

  const filteredRecords = useMemo(
    () => piroDone.filter((item) => item.equipo.toLowerCase().includes(searchTerm.toLowerCase())),
    [piroDone, searchTerm]
  );

  const columns = [
    { accessor: "equipo",      title: "Equipo" },
    {
      accessor: "fechaControl", title: "Fecha",
      render: ({ fechaControl }) => DateTime.fromISO(fechaControl).setZone(ARGENTINA_TIME_ZONE).toFormat("dd-MM-yyyy"),
    },
    { accessor: "responsable", title: "Responsable" },
    { accessor: "resultado",   title: "Resultado" },
    {
      accessor: "pdf", title: "", textAlign: "center",
      render: (item) => (
        <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Descargar registro" onClick={() => handleExportToPDF(item)}>
          <MdArchive />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="pb-4 pt-4 flex items-center gap-3 px-1">
        <span className="text-orange-400 font-semibold">Buscar por equipo:</span>
        <input
          type="text"
          placeholder="Ingrese el equipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="f-input w-64"
        />
      </div>
      <DataTable columns={columns} records={filteredRecords} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay registros" />
    </>
  );
};

export default listadoPirometriaDone;
