import React, { useEffect, useState } from "react";
import { getPedidoMantNotDone } from "../configuracion/api";
import { Table } from "react-bootstrap";
import { DateTime } from "luxon";

const listadoPedidosMant = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const data = async () => {
      const pedidosData = await getPedidoMantNotDone();
      console.log(pedidosData);
      setPedidos(pedidosData);
    };
    data();
  }, []);

  console.log(pedidos);

  if (pedidos.pedido && pedidos.pedido.length !== 0) {
    return (
      <>
      <h1 className=" text-center h1 text-cyan-900">
          Pedidos pendientes de resolución
        </h1>
        <div className="pt-4">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Solicitante</th>
                <th>Equipo</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Condición</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.pedido &&
                pedidos.pedido.map((pedido) => {
                  const fechaFormateada = DateTime.fromISO(
                    pedido.fecha
                  ).toFormat("dd-MM-yyyy");
                  return (
                    <tr key={pedido._id}>
                      <td>{pedido.solicitante}</td>
                      <td>{pedido.equipo}</td>
                      <td>{fechaFormateada}</td>
                      <td>{pedido.motivo}</td>
                      <td>{pedido.condicion}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1 className=" text-center h1 text-cyan-900">
          No hay pedidos de mantenimiento pendientes
        </h1>
      </>
    );
  }
};

export default listadoPedidosMant;
