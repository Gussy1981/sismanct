import React, { useEffect, useState } from "react";
import { getAllTaskNotDone } from "../configuracion/api";
import MotivosChart from "../graficos/MotivosChart";
import EquiposChart from "../graficos/EquiposChart";
import ResponsableChart from "../graficos/ResponsableChart";
import TareasChart from "../graficos/TareasChart";
import TaskNotDoneTable from "../Tablas/TaskNotDoneTable";

const listadoTaskNotDone = () => {
  const [taskNotDone, setTaskNotDone] = useState([]);
  const [grupoMotivo, setGrupoMotivo] = useState({});
  const [grupoEquipo, setGrupoEquipo] = useState({});
  const [grupoResponsable, setGrupoResponsable] = useState({});
  const [grupoTarea, setGrupoTarea] = useState({});
  const [showMode, setShowMode] = useState(true); //Estado para ver listado (false) o graficos (true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTaskNotDone();
        console.log(response);
        setTaskNotDone(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(taskNotDone.taskNotdone);

  useEffect(() => {
    const data = taskNotDone.taskNotdone;
    if (data && Array.isArray(data)) {
      const agrupadoPorMotivo = {};
      const agrupadoPorEquipo = {};
      const agrupadoPorResponsable = {};
      const agrupadoPorTarea = {};

      for (const obj of data) {
        const motivo = obj.motivo;
        const equipo = obj.task.equipo;
        const responsable = obj.task.encargado;
        const tarea = obj.task.tarea;
        console.log("equipos", equipo);
        console.log("motivos", motivo);

        if (!agrupadoPorMotivo[motivo]) {
          agrupadoPorMotivo[motivo] = [];
        }
        agrupadoPorMotivo[motivo].push(obj);

        if (!agrupadoPorResponsable[responsable]) {
          agrupadoPorResponsable[responsable] = [];
        }
        agrupadoPorResponsable[responsable].push(obj);

        if (!agrupadoPorEquipo[equipo]) {
          agrupadoPorEquipo[equipo] = [];
        }
        agrupadoPorEquipo[equipo].push(obj);

        if (!agrupadoPorTarea[tarea]) {
          agrupadoPorTarea[tarea] = [];
        }
        agrupadoPorTarea[tarea].push(obj);
      }
      const cantidadesPorMotivo = {};
      const cantidadesPorEquipo = {};
      const cantidadesPorResponsable = {};
      const cantidadesPorTareas = {};

      Object.keys(agrupadoPorMotivo).forEach((motivo) => {
        cantidadesPorMotivo[motivo] = agrupadoPorMotivo[motivo].length;
      });
      setGrupoMotivo(cantidadesPorMotivo);
    
      Object.keys(agrupadoPorEquipo).forEach((equipo) => {
      cantidadesPorEquipo[equipo] = agrupadoPorEquipo[equipo].length;
    });

      Object.keys(agrupadoPorResponsable).forEach((responsable) => {
      cantidadesPorResponsable[responsable] = agrupadoPorResponsable[responsable].length;
    });

      Object.keys(agrupadoPorTarea).forEach((tarea) => {
      cantidadesPorTareas[tarea] = agrupadoPorTarea[tarea].length;
    });
    setGrupoMotivo(cantidadesPorMotivo);
    setGrupoEquipo(cantidadesPorEquipo);
    setGrupoResponsable(cantidadesPorResponsable);
    setGrupoTarea(cantidadesPorTareas);
  }
  }, [taskNotDone]);

  console.log(grupoMotivo);

  const handleChangeMode = () => {
    if (!showMode) {
      setShowMode(true);
    } else {
      setShowMode(false);
    }
  };

  return (
    <>
    <div className="pt-3 justify-center text-center ">Mantenimiento Preventivo No Cumplido</div>
    
      {!showMode ? (
        <div className=" px-3 ">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleChangeMode()}
          >
            Ver Gráficos
          </button>
        </div>
      ) : (
        <div className=" px-3 ">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleChangeMode()}
          >
            Ver Listado
          </button>
        </div>
      )}
      {Object.keys(grupoMotivo).length === 0 ? (
        <p className=" text-center h1 text-cyan-900">No Hay Indicadores Para Mostrar</p>
      ) : (
        <>
          {!showMode ? (
            <TaskNotDoneTable taskNotDone={taskNotDone}/>
          ) : (
            <div className="flex py-4 w-[90%] space-x-5">
              <div className=" w-[25%] rounded-lg bg-gray-900 py-3 px-3">
                <h2 className=" text-center ">
                  Tareas no Cumplidas por Motivos
                </h2>
                <MotivosChart motivo={grupoMotivo} />
              </div>
              <div className=" w-[25%] rounded-lg bg-gray-900 py-3 px-3">
                <h2 className=" text-center ">
                  Tareas no Cumplidas por Equipos
                </h2>
                <EquiposChart equipo={grupoEquipo} />
              </div>
              <div className=" w-[25%] rounded-lg bg-gray-900 py-3 px-3">
                <h2 className=" text-center ">
                  Tareas no Cumplidas por Empleados
                </h2>
                <ResponsableChart responsable={grupoResponsable} />
              </div>
              <div className=" w-[25%] rounded-lg bg-gray-900 py-3 px-3">
                <h2 className=" text-center ">
                  Tareas no Cumplidas
                </h2>
                <TareasChart tarea={grupoTarea} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default listadoTaskNotDone;
