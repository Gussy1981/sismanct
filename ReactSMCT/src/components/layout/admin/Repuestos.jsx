import React from "react";
import ListadoRepuestos from "../../listados/listadoRepuestos";

const repuestos = () => {
  return (
    <>
      <div className="flex justify-center items-center text-center h4 py-4">
        Alta, Baja y Modificaciones de Repuestos
      </div>
      <ListadoRepuestos />
    </>
  );
};

export default repuestos;
