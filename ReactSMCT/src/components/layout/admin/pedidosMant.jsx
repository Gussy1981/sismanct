import { useState, useEffect } from "react";
import { getPedidoMantNotDone } from "../../configuracion/api";
import { DataTable } from "mantine-datatable";
import { formatDateOnly } from "../../../helpers/dateOnly";
import { useNavigate } from "react-router-dom";

const pedidosMant = () => {
  const [pedidos, setPedidos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      const pedidosData = await getPedidoMantNotDone();
      setPedidos(pedidosData);
    };
    data();
  }, []);

  const handleFixIt = (pedido) => {
    navigate("/admin/correctivo/", { state: { pedido } });
  };

  const columns = [
    { accessor: "solicitante", title: "Solicitante" },
    { accessor: "equipo",      title: "Equipo" },
    {
      accessor: "fecha", title: "Fecha",
      render: ({ fecha }) => formatDateOnly(fecha),
    },
    { accessor: "motivo",    title: "Motivo" },
    { accessor: "condicion", title: "Condición" },
    {
      accessor: "accion", title: "", textAlign: "center",
      render: (pedido) => (
        <button className="btn-primary text-xs py-1 px-3" onClick={() => handleFixIt(pedido)}>
          Correctivo
        </button>
      ),
    },
  ];

  if (!pedidos.pedido || pedidos.pedido.length === 0) {
    return (
      <h1 className="text-center text-lg text-zinc-400 pt-4">
        No hay pedidos de mantenimiento pendientes
      </h1>
    );
  }

  return (
    <DataTable columns={columns} records={pedidos.pedido} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay pedidos pendientes" />
  );
};

export default pedidosMant;
