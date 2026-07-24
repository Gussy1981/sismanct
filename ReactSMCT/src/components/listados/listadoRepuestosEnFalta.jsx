import { useEffect, useState } from "react";
import { getRepuestoFaltante } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import FormRepuesto from "../forms/FormRepuestos";
import { MdShoppingCart } from "react-icons/md";

const listadoRepuestosEnFalta = () => {
  const [enFalta, setEnFalta] = useState({});
  const [mode, setMode] = useState("");
  const [repuestoToModify, setRepuestoToModify] = useState("");

  const data = async () => {
    try {
      const faltanteData = await getRepuestoFaltante();
      setEnFalta(faltanteData);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { data(); }, []);

  const handleChange = (repuesto) => { setMode("Edit"); setRepuestoToModify(repuesto); };
  const updateRepuestoList = () => data();
  const updateOk = () => setMode("");

  if (enFalta.message === "No hay faltante de repuestos") {
    return (
      <div className="flex justify-center text-zinc-400 text-lg pt-4">
        No hay repuestos críticos en falta
      </div>
    );
  }

  const columns = [
    { accessor: "equipo",   title: "Equipo" },
    { accessor: "nombre",   title: "Nombre" },
    { accessor: "marca",    title: "Marca" },
    { accessor: "tipo",     title: "Tipo" },
    { accessor: "cantidad", title: "Cantidad" },
    { accessor: "minStock", title: "Stock mín." },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (repuesto) => (
        <button className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors" title="Ingresar compra" onClick={() => handleChange(repuesto)}>
          <MdShoppingCart />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-center text-red-400 font-semibold text-lg pb-4">
        ¡Falta stock en algunos repuestos!
      </div>
      {mode === "Edit" ? (
        <FormRepuesto mode={mode} repuesto={repuestoToModify} updateRepuestoList={updateRepuestoList} updateOk={updateOk} />
      ) : (
        <DataTable columns={columns} records={enFalta.repuestosToReturn ?? []} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="Sin faltantes" />
      )}
    </>
  );
};

export default listadoRepuestosEnFalta;
