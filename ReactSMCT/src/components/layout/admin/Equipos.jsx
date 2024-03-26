import React from "react";
import ListadoEquipos from "../../listados/listadoEquipos";

const equipos = () => {
  return (
    <>
      <div className="flex justify-center items-center text-center h4 py-4">
        Alta - Baja y Modificaciones de Equipos
      </div>
      <ListadoEquipos />
    </>
  );
};

export default equipos;
