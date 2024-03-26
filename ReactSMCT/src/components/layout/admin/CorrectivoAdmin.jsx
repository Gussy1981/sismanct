import React, { useState, useEffect } from "react";
import ListadoCorrectivo from "../../listados/listadoCorrectivo";
import { useLocation } from "react-router-dom";

const CorrectivoAdmin = () => {
  const location = useLocation();
  if (location.state) {
    console.log(location.state.pedido);

    const [pedido, setPedido] = useState([]);

    const stateSetter = () => {
      if (location.state.pedido) {
        setPedido(location.state.pedido);
      } else {
        setPedido([]);
      }
    };

    useEffect(() => {
      stateSetter();
    }, []);

    console.log("Veo estado de pedido", pedido);

    return (
      <>
        <div className="flex justify-center items-center text-center h4 py-4">
          Gestion de Mantenimiento Correctivo
        </div>
        <ListadoCorrectivo pedido={pedido} />
      </>
    );
  } else {
    return (
      <>
        <div className="flex justify-center items-center text-center h4 py-4">
          Gestion de Mantenimiento Correctivo
        </div>
        <ListadoCorrectivo />
      </>
    );
  }
};

export default CorrectivoAdmin;
