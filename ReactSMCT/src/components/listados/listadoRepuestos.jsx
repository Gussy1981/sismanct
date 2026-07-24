import { useEffect, useState } from "react";
import { getRepuesto, deleteRepuesto } from "../configuracion/api";
import FormRepuesto from "../forms/FormRepuestos";
import KpiCriticosOffcanvas from "../repuestos/KpiCriticosOffcanvas";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoRepuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [mode, setMode] = useState("");
  const [repuestoToModify, setRepuestoToModify] = useState("");
  const [selection, setSelection] = useState(false);
  const [filtroCriticidad, setFiltroCriticidad] = useState("Todos");
  const [showKpiCriticos, setShowKpiCriticos] = useState(false);

  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };

  const data = async () => {
    const repuestosData = await getRepuesto();
    const sorted = repuestosData.repuesto.sort((a, b) =>
      a.equipo.localeCompare(b.equipo)
    );
    setRepuestos(sorted);
  };

  useEffect(() => { data(); }, []);

  const handleChange = (repuesto) => {
    setMode("Edit");
    setRepuestoToModify(repuesto);
    setSelection(true);
  };

  const updateRepuestoList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };

  const repuestosFiltrados = repuestos.filter((r) =>
    filtroCriticidad === "Todos" ? true : (r.criticidad ?? "Normal") === filtroCriticidad
  );

  const handleDelete = (repuestoId, nombreRepuesto) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar ${nombreRepuesto}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRepuesto(repuestoId)
          .then((response) => {
            if (response.data.status === "Success") {
              Swal.fire("¡Repuesto eliminado!", "", "success");
              data();
            } else {
              Swal.fire("Error", response.data.message, "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Hubo un problema al eliminar el repuesto", "error");
          });
      }
    });
  };

  const columns = [
    { accessor: "equipo",   title: "Equipo" },
    { accessor: "nombre",   title: "Nombre" },
    { accessor: "marca",    title: "Marca" },
    { accessor: "tipo",     title: "Tipo" },
    { accessor: "otras",    title: "Otras características" },
    { accessor: "cantidad", title: "Cantidad" },
    { accessor: "minStock", title: "Stock mín." },
    { accessor: "precio",   title: "Precio" },
    {
      accessor: "criticidad",
      title: "Criticidad",
      textAlign: "center",
      render: ({ criticidad }) => (
        <span
          className={
            (criticidad ?? "Normal") === "Critico"
              ? "px-2 py-1 rounded text-xs font-semibold bg-red-900 text-red-200"
              : "px-2 py-1 rounded text-xs font-semibold bg-zinc-700 text-zinc-300"
          }
        >
          {(criticidad ?? "Normal") === "Critico" ? "Crítico" : "Normal"}
        </span>
      ),
    },
    {
      accessor: "acciones",
      title: "",
      textAlign: "center",
      render: (repuesto) => (
        <div className="flex justify-center gap-3">
          <button
            className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors"
            title="Modificar"
            onClick={() => handleChange(repuesto)}
          >
            <MdEditDocument />
          </button>
          <button
            className="text-red-500 hover:text-red-400 text-xl transition-colors"
            title="Eliminar"
            onClick={() => handleDelete(repuesto._id, repuesto.nombre)}
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="px-3 mb-4 flex flex-wrap items-center gap-3">
        {!selection ? (
          <button className="btn-success" onClick={handleAdd}>Agregar Repuesto</button>
        ) : (
          <button className="btn-secondary" onClick={handleBack}>Volver</button>
        )}
        {!selection && (
          <div className="flex gap-2">
            {["Todos", "Critico", "Normal"].map((opcion) => (
              <button
                key={opcion}
                className={filtroCriticidad === opcion ? "btn-primary" : "btn-secondary"}
                onClick={() => setFiltroCriticidad(opcion)}
              >
                {opcion === "Critico" ? "Críticos" : opcion === "Normal" ? "Normales" : "Todos"}
              </button>
            ))}
          </div>
        )}
        {!selection && (
          <button className="btn-secondary" onClick={() => setShowKpiCriticos(true)}>
            KPI Críticos Utilizados
          </button>
        )}
      </div>

      <KpiCriticosOffcanvas show={showKpiCriticos} handleClose={() => setShowKpiCriticos(false)} />

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
        <DataTable
          columns={columns}
          records={repuestosFiltrados}
          withTableBorder
          borderRadius="sm"
          striped
          highlightOnHover
          minHeight={150}
          noRecordsText="No hay repuestos registrados"
        />
      )}
    </>
  );
};

export default listadoRepuestos;
