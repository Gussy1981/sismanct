import { useState, useEffect } from "react";
import { getEquipos, deleteEquipo } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import FormEquipos from "../forms/FormEquipos";
import { MdDelete, MdEditDocument } from "react-icons/md";

const listadoEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [mode, setMode] = useState("");
  const [equipoToModify, setEquipoToModify] = useState("");
  const [selection, setSelection] = useState(false);

  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };

  const data = async () => {
    const equiposData = await getEquipos();
    const sorted = equiposData.equipo.sort((a, b) => a.codigo.localeCompare(b.codigo));
    setEquipos(sorted);
  };

  useEffect(() => { data(); }, []);

  const handleChange = (equipo) => { setMode("Edit"); setEquipoToModify(equipo); setSelection(true); };
  const updateEquipoList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };

  const handleDelete = (equipoId, codigoEquipo) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar ${codigoEquipo}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEquipo(equipoId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Equipo eliminado!", "", "success"); data(); }
            else Swal.fire("Error", response.data.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el equipo", "error"));
      }
    });
  };

  const columns = [
    { accessor: "tipo",         title: "Tipo" },
    { accessor: "codigo",       title: "Código" },
    { accessor: "clasificacion", title: "Clasificación" },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (equipo) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(equipo)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(equipo._id, equipo.codigo)}>
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="px-3 mb-4">
        {!selection
          ? <button className="btn-success" onClick={handleAdd}>Agregar Equipo</button>
          : <button className="btn-secondary" onClick={handleBack}>Volver</button>}
      </div>
      {mode === "Edit" ? (
        <FormEquipos mode={mode} equipo={equipoToModify} updateEquipoList={updateEquipoList} updateOk={updateOk} />
      ) : mode === "Add" ? (
        <FormEquipos mode={mode} updateEquipoList={updateEquipoList} />
      ) : (
        <DataTable columns={columns} records={equipos} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay equipos registrados" />
      )}
    </div>
  );
};

export default listadoEquipos;
