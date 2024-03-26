import React, { useEffect, useState } from "react";
import { getTareasByEquipo, getTaskNotDone } from "../configuracion/api"; //Importo el componente que hace la consulta a la BD
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import TareasNoCumplidas from "./TareasNoCumplidas";

const TareasByEquipo = () => {
  
  const { id } = useParams(); // Obtengo el id de la tarea a traves de la ruta.
  console.log("Este es el id" + id);

  const userRole = useAuth().user.role; //Obtengo el role del usuario, desde el provider de user
  console.log(userRole);
  
  const userName = useAuth().user.name; // obtengo los datos del usuario registrado
  console.log(userName);

  const userId = useAuth().user.id; // Obtengo el id del usuario logueado.
  console.log(userId);
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tareas, setTareas] = useState([]);
  const [ noTareas, setNoTareas ] = useState([]); // Preparo un estado para recibir las tareas no realizadas

  useEffect(() => {
    const data = async () => {
      try {
      const tareasData = await getTareasByEquipo(id); //Obtengo los datos de la consulta a la BD (taskTodo/listbyequipo)
      console.log(tareasData); //Verifico por consola que llega la info
      if(tareasData.message === "No hay Tareas programadas") {
        setTareas([]);
      }else{
      //Configuro el estado con la lista de tareas, ordenando por su frecuencia.
      setTareas(
        tareasData.tasks.sort((a, b) =>
          a.frecuencia.localeCompare(b.frecuencia)
        )
      );
    } 
    } catch (error) {
      console.log(error)
    }
    };
      data();
      const interval = setInterval(data, 600000);
      return () => clearInterval(interval);
    
  }, [id]);

  useEffect(() => {
    const dataNoTask = async () => {
      try {
        //cambiar userId por userName
      const noTareasData = await getTaskNotDone(userName); // Obtengo un arreglo de tareas no realizadas por el usuario
      console.log("Tareas No Realizadas", noTareasData.newData);
      setNoTareas(noTareasData.newData);
    } catch (error) {
      console.log(error);
    }
    };
      dataNoTask();
  }, [userName]);

  const handleButtonClick = (tarea) => {
    Swal.fire({
      title: "¿Cuantos minutos te llevo la tarea?",
      html:
      '<label for="tiempo">Minutos:</label>' +
      '<input id="tiempo" type="number" min="1" step="1" class="swal2-input"' +
      '<label for="comentarios">Comentarios:</label>' +
      '<textarea id="comentarios" class="swal2-textarea"></textarea>',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const time = document.getElementById("tiempo").value; //genero una variable tiempo con el valor ingresado por el usuario
        const comentarios = document.getElementById("comentarios").value; //genero una variable para almacenar los comentarios
        console.log(`Tiempo ingresado: ${time} minutos`);
        console.log(`Comentarios ingresados: ${comentarios}`);
        console.log(token);
        console.log(`Usuario autenticado: ${userName}`);
        console.log(`Encargado de la tarea: ${tarea.encargado}`);

        // Envio el valor de tiempo y el usuario a TaskDone
        fetch(Global.url + `tasktodo/cumplirtarea/${tarea._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            tiempo: time,
            comentarios: comentarios,
            encargado: tarea.encargado,
            ejecutante: userName,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setTareas((prevTareas) =>
              prevTareas.filter((prevTarea) => prevTarea._id !== tarea._id)
            );
            console.log(tareas);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  
  const handleButtonVolver = () =>{
    if(userRole === "Empleado") {
      navigate("/preventivo")
    } else {
      navigate("/admin/preventivo")
    }
  }
  // Cuando se ejecuta la función onConplete en TareasNoCumplidas con un array vacio, ese array llega aqui como
  // prop y se guarda en el estado de TareasByEquipo, al ser vacio, se renderizan las tareas para hacer.
  const handleJustifiedTasks = (noTareasCompletadas) => { 
    setNoTareas(noTareasCompletadas);
  };

  const returnTareasByEquipo = (
    <>
      <div className="text-lg font-medium mb-4 text-center">
        {" "}
        MANTENIMIENTO PREVENTIVO{" "}
      </div>
      {tareas.length > 0 && (
        <div className="text-lg font-medium mb-4 text-center">
          {" "}
          Equipo: {tareas[0].equipo}{" "}
        </div>
      )}
      <div className="pt-4">
      <Table hover variant="dark">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Frecuencia</th>
            <th>Encargado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea._id}>
              <td>{tarea.tarea}</td>
              <td>{tarea.frecuencia}</td>
              <td>{tarea.encargado}</td>
              <td>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleButtonClick(tarea)}
                >
                  Cumplir Tarea
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleButtonVolver()}
      >
        Volver a pantalla principal
      </button>
    </>
  )

  if (tareas.length === 0){
    return (
      <>
        <div className="flex justify-center">
          <div className=" text-center h1 text-cyan-900 pt-5">
              No hay tareas programadas para hoy
          </div>

        </div>
      </>
    )
  } else {
  return (
    
    <>
      {noTareas.length > 0 ? (<TareasNoCumplidas tareas={noTareas} onComplete={handleJustifiedTasks}/>) : (returnTareasByEquipo)}
    </>  
  );
}
};

export default TareasByEquipo;
