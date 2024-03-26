import React from "react";
import PedidoMant from "./pedidosMant";
import ListadoTaskNotDone from "../../listados/listadoTaskNotDone";
import ListadoRepuestosEnFalta from "../../listados/listadoRepuestosEnFalta";
import ListadoVerificarPiro from "../../listados/listadoVerificarPiro";

const AdminHome = () => {
  return (
    <>
    <div className="pt-4 justify-center h-screen">
      <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
        <h1 className="text-center h4">Pedidos de Mantenimiento</h1>
        <PedidoMant />
      </div>

      <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
      <h1 className="text-center h4">Repuestos Criticos en faltas</h1> 
        <ListadoRepuestosEnFalta/>
      </div>

      <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
      <h1 className="text-center h4">Registros de Pirometria</h1> 
        <ListadoVerificarPiro/>
      </div>

      <div className="w-[90%] mx-auto rounded-lg border-4 border-cyan-800 p-4 mt-4">
      <h1 className="text-center h4">Indicadores de Mantenimiento</h1> 
        <ListadoTaskNotDone/>
      </div>
      </div>
    </>
  );
};

export default AdminHome;
