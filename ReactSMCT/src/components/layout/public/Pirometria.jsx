import { useEffect, useState } from "react";
import { getPiroInit } from "../../configuracion/api";
import { DataTable } from "mantine-datatable";
import FormCumplirPirometria from "../../forms/FormCumplirPirometria";

const Pirometria = () => {
  const [listado, setListado] = useState([]);
  const [mode, setMode] = useState("");
  const [itemToModify, setItemToModify] = useState([]);

  const data = async () => {
    const piroData = await getPiroInit();
    setListado(piroData.pirometriasToReturn);
  };

  useEffect(() => { data(); }, []);

  const handleClick = (item) => { setItemToModify(item); setMode("Edit"); };
  const updateOk = () => setMode("");
  const updateListAfterSave = () => data();

  const columns = [
    { accessor: "equipo",      title: "Equipo" },
    { accessor: "temperatura", title: "Rango temperatura" },
    { accessor: "responsable", title: "Responsable" },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (item) => (
        <button className="btn-success text-xs py-1 px-3" onClick={() => handleClick(item)}>
          Cumplir
        </button>
      ),
    },
  ];

  if (!listado || listado.length === 0) {
    return (
      <div className="flex justify-center pt-10">
        <p className="text-zinc-400 text-lg">No hay controles por hacer</p>
      </div>
    );
  }

  return (
    <>
      {mode === "Edit" ? (
        <FormCumplirPirometria mode={mode} initialValues={itemToModify} updateOk={updateOk} updateListAfterSave={updateListAfterSave} />
      ) : (
        <DataTable columns={columns} records={listado} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay controles por hacer" />
      )}
    </>
  );
};

export default Pirometria;
