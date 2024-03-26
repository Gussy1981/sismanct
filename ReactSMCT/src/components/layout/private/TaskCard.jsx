import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { Global } from "../../../helpers/Global";

const TaskCard = ({ task, setTasks }) => {
  const userRole = useAuth().auth.role; //Obtengo el role del usuario, desde el provider de user
  console.log(userRole);
  const userName = useAuth().auth; // obtengo los datos del usuario registrado
  console.log(userName);
  const token = localStorage.getItem("token");

  const [taskDone, setTaskDone] = useState(false);

  const handleButtonClick = () => {
    Swal.fire({
      title: "¿Cuantos minutos te llevo la tarea?",
      input: "number",
      inputLabel: "Minutos",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const time = result.value; //genero una variable tiempo con el valor ingresado por el usuario
        console.log(`Tiempo ingresado: ${time} minutos`);
        console.log(token);
        console.log(`Usuario autenticado: ${userName.name}`);
        console.log(`Encargado de la tarea: ${task.encargado.name}`);
  
        // Envio el valor de tiempo y el usuario a TaskDone
        fetch(Global.url + `tasktodo/cumplirtarea/${task._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            tiempo: time,
            encargado: task.encargado.name,
            ejecutante: userName.name,
          })
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setTaskDone(true);
            setTasks((prevTasks) =>
              prevTasks.filter((prevTask) => prevTask._id !== task._id)
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  
  return (
    <>
      {!taskDone && (
          <div className="bg-gray-400 shadow-lg rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium mb-2">{task.tarea.tipotarea}</h2>
          <p className="text-gray-700 text-sm mb-2">{task.frecuencia}</p>
          <p className="text-gray-700 text-sm mb-2">{task.encargado.name}</p>
          {userRole == "Empleado" && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleButtonClick}>
              Cumplir Tarea
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default TaskCard;

/*
const TaskCard = ({ task }) => {: esta línea define un componente de función llamado TaskCard, que recibe una única propiedad llamada task. El componente está definido como una función de flecha.

<div className="bg-white shadow-lg rounded-lg p-4 mb-4">: esta línea crea un div con una serie de clases de estilo de Tailwind para establecer el fondo blanco, las sombras, los bordes redondeados y el espacio alrededor de la tarjeta.

<h2 className="text-lg font-medium mb-2">{task.tarea.tipotarea}</h2>: esta línea crea un encabezado de segundo nivel que muestra el tipo de tarea que se obtiene de la propiedad task.tarea.tipotarea.

<p className="text-gray-700 text-sm mb-2">{task.equipo.codigo}</p>: esta línea crea un párrafo que muestra el código del equipo de la tarea, que se obtiene de la propiedad task.equipo.codigo.

<p className="text-gray-700 text-sm mb-2">{task.frecuencia}</p>: esta línea crea otro párrafo que muestra la frecuencia de la tarea, que se obtiene de la propiedad task.frecuencia.

<p className="text-gray-700 text-sm mb-2">{task.encargado.name}</p>: esta línea crea otro párrafo que muestra el nombre del encargado de la tarea, que se obtiene de la propiedad task.encargado.name.

</div>: cierra el div que se creó en el paso 3.

};: cierra la función de flecha definida en el paso 2.

export default TaskCard;: exporta el componente TaskCard para que pueda ser utilizado en otros archivos.*/
