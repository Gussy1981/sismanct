import { useEffect, useState, useMemo, useRef } from "react";
import { getCorrectivo, deleteCorrectivo } from "../configuracion/api";
import FormCorrectivo from "../forms/FormMantCorrectivo";
import CorrectivoOffcanvas from "../correctivo/CorrectivoOffcanvas";
import { DataTable } from "mantine-datatable";
import { DateTime } from "luxon";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import ExportToExcel from "../ExportToExcel/ExportToExcel";

const listadoCorrectivo = ({ pedido }) => {
  const [correctivos, setCorrectivos] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [repuestoSelect, setRepuestoSelect] = useState(false);
  const [mode, setMode] = useState("");
  const [correctivoToModify, setCorrectivoToModify] = useState("");
  const [selection, setSelection] = useState(false);
  const [pedidoMant, setPedidoMant] = useState();
  const [sortStatus, setSortStatus] = useState({ columnAccessor: "fecha", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);

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

  useEffect(() => {
    setPedidoMant(pedido);
    if (pedido) setMode("Add");
  }, [pedido]);

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

  const handleChange = (option) => { setMode("Edit"); setCorrectivoToModify(option); setSelection(true); };
  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };
  const updateCorrectivoList = () => fetchData(searchTerm);
  const updateOk = () => { setSelection(false); setMode(""); };

  const handleDelete = (optionId, motivo, equipo) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar ${motivo} en ${equipo}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCorrectivo(optionId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Correctivo eliminado!", "", "success"); fetchData(searchTerm); }
            else Swal.fire("Error", response.data.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el correctivo", "error"));
      }
    });
  };

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
      accessor: "repuestos", title: "Repuestos", textAlign: "center",
      render: (option) => option.repuestosUtilizados.length > 0 && (
        <button className="text-blue-400 hover:text-blue-300 text-xl transition-colors" title="Ver repuestos" onClick={() => { setShowOffcanvas(true); setRepuestoSelect(option.repuestosUtilizados); }}>
          <FcViewDetails />
        </button>
      ),
    },
    {
      accessor: "responsables", title: "Responsables",
      render: ({ responsables }) => responsables.join(", "),
    },
    { accessor: "tiempo", title: "Tiempo (min)" },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (option) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(option)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(option._id, option.motivo, option.equipo)}>
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex gap-3 pb-4 px-3">
        {!selection ? (
          <>
            <button className="btn-success" onClick={handleAdd}>Alta Correctivo</button>
            <ExportToExcel tableRef={tableRef} filename="Tabla Correctivo" sheet="Correctivo" />
          </>
        ) : (
          <button className="btn-secondary" onClick={handleBack}>Volver</button>
        )}
      </div>

      {mode === "Edit" ? (
        <FormCorrectivo mode={mode} option={correctivoToModify} updateList={updateCorrectivoList} updateOk={updateOk} />
      ) : mode === "Add" ? (
        <FormCorrectivo mode={mode} pedidoMant={pedidoMant} updateList={updateCorrectivoList} updateOk={updateOk} />
      ) : (
        <>
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
            tableProps={{ ref: tableRef }}
          />
        </>
      )}

      <CorrectivoOffcanvas show={showOffcanvas} handleCloseOffcanvas={() => setShowOffcanvas(false)} repuestoSelect={repuestoSelect} />
    </>
  );
};

export default listadoCorrectivo;
