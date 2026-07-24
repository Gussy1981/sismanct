import { useEffect, useState } from "react";
import { getPedidoMantNotDone } from "../configuracion/api";
import { DataTable } from "mantine-datatable";
import { DateTime } from "luxon";

const listadoPedidosMant = () => {
  const [pedidos, setPedidos] = useState({});

  useEffect(() => {
    const data = async () => {
      const pedidosData = await getPedidoMantNotDone();
      setPedidos(pedidosData);
    };
    data();
  }, []);

  const columns = [
    { accessor: "solicitante", title: "Solicitante" },
    { accessor: "equipo",      title: "Equipo" },
    {
      accessor: "fecha", title: "Fecha",
      render: ({ fecha }) => DateTime.fromISO(fecha).toFormat("dd-MM-yyyy"),
    },
    { accessor: "motivo",    title: "Motivo" },
    { accessor: "condicion", title: "Condición" },
  ];

  if (!pedidos.pedido || pedidos.pedido.length === 0) {
    return (
      <h1 className="text-center text-lg text-zinc-400 pt-4">
        No hay pedidos de mantenimiento pendientes
      </h1>
    );
  }

  return (
    <>
      <h1 className="text-center text-lg font-semibold text-orange-400 pb-4">
        Pedidos pendientes de resolución
      </h1>
      <DataTable columns={columns} records={pedidos.pedido} withTableBorder borderRadius="sm" striped highlightOnHover minHeight={150} noRecordsText="No hay pedidos pendientes" />
    </>
  );
};

export default listadoPedidosMant;
