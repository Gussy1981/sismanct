import React, { useState, useEffect } from "react";
import { getPiroDone } from "../configuracion/api";
import { useNavigate } from "react-router-dom";

export const listadoVerificarPiro = () => {
  const [piroDone, setPiroDone] = useState([]);
  
  const navigate = useNavigate();

  const dataFetch = async () => {
    const response = await getPiroDone();
    console.log(response);
    //verificar si los datos son un array antes de filtrar
    if (Array.isArray(response.registros)) {
      const data = response.registros;
      //filtro los registros que no tienen la propiedad resultado como null
      const registros = data.filter((registros) => !registros.resultado);
      console.log(registros);
      setPiroDone(registros);
    } else {
      console.error("Los datos no son un array");
    }
  };

  useEffect(() => {
    dataFetch();
  }, []);
  
  const handleFixIt = () =>{
    navigate(`/admin/checkPiro/`,
    {
      state:{
        piroDone
      }
    });
  };

  if (piroDone && piroDone.length !== 0) {
    return (
      <div>
        <h1 className=" text-center h1 text-yellow-600">
          Hay Controles de Pirometria para Verificar
        </h1>
        <div className="pt-3">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleFixIt()}
          >
            Ir a Pirometrias
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1 className=" text-center h1 text-cyan-900">
          No hay Registros de Pirometria para Verificar
        </h1>
      </>
    );
  }
};

export default listadoVerificarPiro;
