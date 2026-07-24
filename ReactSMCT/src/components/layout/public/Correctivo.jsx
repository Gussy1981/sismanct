import { useEffect, useState, useMemo } from "react";
import { getCorrectivo } from "../../configuracion/api";
import { DataTable } from "mantine-datatable";
import { DateTime } from "luxon";

const Correctivo = () => {
  const [correctivos, setCorrectivos] = useState([]);
  const [sortStatus, setSortStatus] = useState({ columnAccessor: "fecha", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (term) => {
    try {
      setLoading(true);
      const response = term ? await getCorrectivo(term) : await getCorrectivo();
      setCorrectivos(response);
    } catch (error) {
      console.error("Error al obtener los correctivos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(searchTerm); }, [searchTerm]);

  const sortedCorrectivos = useMemo(() => {
    if (!sortStatus.columnAccessor) return correctivos;
    return [...correctivos].sort((a, b) => {
      const va = a[sortStatus.columnAccessor] ?? "";
      const vb = b[sortStatus.columnAccessor] ?? "";
      return sortStatus.direction === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    });
  }, [correctivos, sortStatus]);

  const columns = [
    {
      accessor: "fecha", title: "Fecha", sortable: true,
      render: ({ fecha }) => DateTime.fromISO(fecha).toFormat("dd-MM-yyyy"),
    },
    { accessor: "equipo",      title: "Equipo",      sortable: true },
    { accessor: "solicitante", title: "Solicitante" },
    { accessor: "motivo",      title: "Motivo",      sortable: true },
    { accessor: "tareas",      title: "Tarea",       sortable: true },
    {
      accessor: "responsables", title: "Responsables",
      render: ({ responsables }) => responsables.join(", "),
    },
    { accessor: "tiempo", title: "Tiempo (min)" },
  ];

  return (
    <>
      <h1 className="text-center font-semibold text-lg py-3">Mantenimiento Correctivo</h1>
      <div className="pb-4 flex items-center gap-3 px-1">
        <span className="text-orange-400 font-semibold">Buscador:</span>
        <input
          type="text"
          placeholder="Ingrese texto de búsqueda"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="f-input w-64"
        />
      </div>
      <DataTable
        columns={columns}
        records={sortedCorrectivos}
        fetching={loading}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={150}
        noRecordsText="No hay registros correctivos"
      />
    </>
  );
};

export default Correctivo;
