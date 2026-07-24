import { useEffect, useState } from "react";
import { getPirometria, deletePirometria, updateInicioPiro } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import FormAltaPirometria from "../forms/FormAltaPirometria";
import { MdDelete, MdEditDocument, MdPlayCircle, MdStopCircle } from "react-icons/md";
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
    setPirometrias(piroData);
  };

  useEffect(() => { data(); }, []);

  const handleAdd = () => { setSelection(true); setMode("Add"); };
  const handleBack = () => { setSelection(false); setMode(""); };
  const handleList = () => navigate("/pirometria");
  const handleChange = (pirometria) => { setMode("Edit"); setPiroToModify(pirometria); setSelection(true); };
  const updatePiroList = () => data();
  const updateOk = () => { setSelection(false); setMode(""); };

  const handleEdit = async (piroId) => { await updateInicioPiro(piroId); await data(); };

  const handleDelete = (pirometriaId, codigoEquipo) => {
    Swal.fire({
      title: `¿Estás seguro que querés eliminar el registro de ${codigoEquipo}?`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePirometria(pirometriaId)
          .then((response) => {
            if (response.data.status === "Success") { Swal.fire("¡Registro eliminado!", "", "success"); data(); }
            else Swal.fire("Error", response.message, "error");
          })
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el registro", "error"));
      }
    });
  };

  const columns = [
    { accessor: "equipo",      title: "Equipo" },
    { accessor: "temperatura", title: "Rango temperatura" },
    { accessor: "responsable", title: "Responsable" },
    {
      accessor: "acciones", title: "", textAlign: "center",
      render: (piro) => (
        <div className="flex justify-center gap-3">
          <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Modificar" onClick={() => handleChange(piro)}>
            <MdEditDocument />
          </button>
          <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Eliminar" onClick={() => handleDelete(piro._id, piro.equipo)}>
            <MdDelete />
          </button>
          {piro.inicio ? (
            <button className="text-red-500 hover:text-red-400 text-xl transition-colors" title="Detener" onClick={() => handleEdit(piro._id)}>
              <MdStopCircle />
            </button>
          ) : (
            <button className="text-green-500 hover:text-green-400 text-xl transition-colors" title="Iniciar" onClick={() => handleEdit(piro._id)}>
              <MdPlayCircle />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="px-3 mb-4 flex gap-3">
        {!selection ? (
          <>
            <button className="btn-success" onClick={handleAdd}>Nueva Pirometría</button>
            <button className="btn-primary" onClick={handleList}>Ver Registros</button>
          </>
        ) : (
          <button className="btn-secondary" onClick={handleBack}>Volver</button>
        )}
      </div>
      {mode === "Edit" ? (
        <FormAltaPirometria mode={mode} pirometria={piroToModify} updatePiroList={updatePiroList} updateOk={updateOk} />
      ) : mode === "Add" ? (
        <FormAltaPirometria mode={mode} updatePiroList={updatePiroList} />
      ) : (
        <DataTable columns={columns} records={pirometrias} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay pirometrías registradas" />
      )}
    </div>
  );
};

export default listadoPirometria;
