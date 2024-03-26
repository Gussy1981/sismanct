import React, { useEffect, useState } from "react";
import { getTareas } from "../../configuracion/api";
import { Card, Container } from "react-bootstrap";
import iconoCumplidas from "../../../../public/logoCumplido.fw.png";
import iconoNoCumplidas from "../../../../public/logoNoCumplido.fw.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const Preventivo = () => {
  const [tareas, setTareas] = useState([]);
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();


  useEffect(() => {
    const data = async () => {
      const tareasData = await getTareas();
      console.log(tareasData.tasksToReturn);
      if(tareasData.message === "No hay Tareas programadas") {
        setTareas([]);
      } else {
        setTareas(tareasData.tasksToReturn);
      };
    };
    data();
  }, []);

  const handleClick = (id) =>{
    if (user) {
    navigate(`/tareasbyequipo/${id}`);
  } else {
    Swal.fire({
      title: "Tienes que ingresar con tu nombre y DNI",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }
  }

  const tareasByEquipo = tareas.reduce((acc, task) => {
    const codigoEquipo = task.equipo;

    if (!acc[codigoEquipo]) {
      acc[codigoEquipo] = [];
    }

    acc[codigoEquipo].push(task);

    return acc;
  }, {});

  if(tareas.length === 0) {
    return(
      <>
        <div className="flex justify-center">
          <div className=" text-center h1 text-cyan-900 pt-5">
              No Hay Tareas De Mantenimiento Programadas
          </div>

        </div>
      </>
    )
  } else {
  return (
    <>
    <div className="pt-4 justify-center h-screen pb-2">
          <h1 className="text-center h4 pb-3">Mantenimiento Preventivo</h1>
    <Container>
      <div className="flex justify-center space-x-5 w-90">
      {Object.entries(tareasByEquipo).map(([equipo, tareas]) => {

        const tareasTotales = tareas.length; //obtengo la cantidad de tareas en el arreglo
        const tareasNoCumplidas = tareas.filter((task) => !task.estado).length; //obtengo la cantidad de tareas con estado false del arreglo
        const tareasCumplidas = tareasTotales - tareasNoCumplidas; //diferencia para calcular las tareas cumplidas
        
        //defino variables de estilo para aplicar en el texto segun corresponda
        let cumplidoStyle = { color: "black" };
        let pendienteStyle = { color: "yellow" };
        
        if (tareasNoCumplidas === 0) {
          cumplidoStyle = { color: "green" };
          pendienteStyle = { color: "black" };
        }
        return (
          <div key={equipo} className=" inline-flex pt-1 ">
            <Card className=" bg-gray-700 border-2 border-cyan-800 ">
              <Card.Body>
                <Card.Title>{equipo}</Card.Title>
                <div className="flex justify-center py-3">
                <Card.Img
                  variant="top"
                  src={
                    tareasNoCumplidas > 0 ? iconoNoCumplidas : iconoCumplidas
                  }
                  style={{ width: "139px", height: "100px" }}
                  
                />
                </div>
                <Card.Text className=" text-white ">Tareas Programadas: {tareasTotales} </Card.Text>
                <Card.Text style={cumplidoStyle}>
                  Tareas Cumplidas: {tareasCumplidas}{" "}
                </Card.Text>
                <Card.Text style={pendienteStyle}>
                  Tareas Pendientes: {tareasNoCumplidas}{" "}
                </Card.Text>
                <div className="flex justify-center pt-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleClick(tareas[0].equipo)}
                >
                  Ver Tareas
                </button>  
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      })}
      </div>
    </Container>
    </div>
    </>
  );
}
};

export default Preventivo;
