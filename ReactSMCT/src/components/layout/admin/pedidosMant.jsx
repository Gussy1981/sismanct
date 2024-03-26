import React, { useState, useEffect } from "react";
import { getPedidoMantNotDone } from "../../configuracion/api";
import { Table } from "react-bootstrap";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";


const pedidosMant = () => {
  const [pedidos, setPedidos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      const pedidosData = await getPedidoMantNotDone();
      setPedidos(pedidosData);
    };
    data();
  }, []);

  console.log(pedidos);

  const handleFixIt = (pedido) =>{
    navigate(`/admin/correctivo/`,
    {
      state:{
        pedido
      }
    });
  };

  if (pedidos.pedido && pedidos.pedido.length !== 0) {
  return (
    <>
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
                      <td>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleFixIt(pedido)}
                        >
                          Correctivo
                        </button>
                      </td>
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
      <h1 className=" text-center h1 text-cyan-900">No hay pedidos de mantenimiento pendientes</h1>
    </>
  )
}
};

export default pedidosMant;
