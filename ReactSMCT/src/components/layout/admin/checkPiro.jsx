import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { MdOutlineFactCheck } from "react-icons/md";
import { DateTime } from "luxon";
import FormAltaPirometria from "../../forms/FormAltaPirometria";

const checkPiro = () => {
  const location = useLocation();
  const [checkRecords, setCheckRecords] = useState([]);
  const [mode, setMode] = useState("");
  const [piroToCheck, setPiroToCheck] = useState("");
  const [check, setCheck] = useState(false);
  const [idPiro, setIdPiro] = useState("");

  useEffect(() => {
    if (location.state?.piroDone) {
      setCheckRecords(location.state.piroDone);
    }
  }, []);

  if (!location.state) {
    return (
      <div className="flex justify-center items-center text-center text-lg py-10 text-zinc-400">
        No existen registros de pirometría para verificar
      </div>
    );
  }

  const handleCheck = (item) => {
    setMode("Edit");
    setPiroToCheck(item);
    setCheck(true);
    setIdPiro(item._id);
  };

  const columns = [
    { accessor: "equipo",      title: "Equipo" },
    {
      accessor: "fechaControl", title: "Fecha",
      render: ({ fechaControl }) => DateTime.fromISO(fechaControl).toFormat("dd-MM-yyyy"),
    },
    { accessor: "responsable", title: "Responsable" },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (item) => (
        <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Verificar" onClick={() => handleCheck(item)}>
          <MdOutlineFactCheck />
        </button>
      ),
    },
  ];

  return (
    <>
      <p className="flex justify-center items-center text-center font-semibold text-lg py-4">
        Registros de Pirometría para verificar
      </p>
      {mode === "Edit" ? (
        <FormAltaPirometria mode={mode} pirometria={piroToCheck} check={check} idPiro={idPiro} />
      ) : (
        <DataTable columns={columns} records={checkRecords} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay registros para verificar" />
      )}
    </>
  );
};

export default checkPiro;
