import React from "react";
import ListadoUsuarios from "../../listados/listadoUsuarios";

const Usuarios = () => {
  return (
    <div>
      <div className="flex justify-center items-center text-center h4 py-4">
        Alta - Baja y Modificaciones de Usuarios
      </div>
      <ListadoUsuarios />
    </div>
  );
};

export default Usuarios;
