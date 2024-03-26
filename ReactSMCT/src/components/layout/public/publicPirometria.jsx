import React from "react";
import Pirometria from "./Pirometria";
import ListadoPirometriaDone from "../../listados/listadoPirometriaDone";

const publicPirometria = () => {
  return (
    <>
    <div className="pt-4 justify-center">
          <h1 className="text-center h4 pb-3">Control de Pirometria</h1>
    </div>      
      <div className="pt-2 justify-center h-screen">
        <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
          <h1 className="text-center h4">Controles pendientes</h1>
          <Pirometria />
        </div>

        <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
          <h1 className="text-center h4">Controles Verificados</h1>
          <ListadoPirometriaDone />
        </div>
      </div>
    </>
  );
};

export default publicPirometria;
