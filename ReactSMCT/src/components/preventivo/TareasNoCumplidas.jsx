import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Global } from "../../helpers/Global";
import { Table } from "react-bootstrap";
import { DateTime } from "luxon";

const TareasNoCumplidas = ({ tareas, onComplete }) => {
  const [noTareas, setNoTareas] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log(tareas);
    setNoTareas(tareas); // Seteo el estado con lo que recibo de TareasByEquipo
    Swal.fire({
      title: "Tienes tareas no cumplidas, debes justificar los motivos",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }, [tareas]); // Se ejecuta cada vez que haya un cambio en la prop.

  console.log(noTareas);

  if (noTareas.length === 0) {
    Swal.fire("Gracias", "Justificaste todas las tareas", "success").then(
      () => {
        onComplete([]); // Al justificar las tareas, mando el array vacio a tareasbyequipo con la funcion de la prop
      }
    );
  }

  const handleButtonClick = (tarea) => {
    Swal.fire({
      title: "¿Por que no realizaste la tarea?",
      html:
        '<select id="razon" class="swal2-select">' +
        '<option value="No tuve tiempo">No tuve tiempo</option>' +
        '<option value="Me olvide">Me olvide</option>' +
        '<option value="No tenia herramientas">No tenia herramientas</option>' +
        '<option value="Necesitaba repuestos que no habia">Necesitaba repuestos que no habia</option>' +
        '<option value="No era prioridad">No era prioridad</option>' +
        "</select>",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const motivo = document.getElementById("razon").value;
        if (!motivo) {
          Swal.showValidationMessage("Debes ingresar un motivo");
        }
        return { motivo: motivo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(token);
        const motivo = result.value.motivo;
        // Envio el valor de motivo a noTaskDone
        fetch(Global.url + `tasknotdone/update/${tarea._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            motivo: JSON.stringify(motivo),
            motivoEstado: true,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setNoTareas((prevTareas) =>
              prevTareas.filter((prevTarea) => prevTarea._id !== tarea._id)
            );

            console.log(noTareas);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <div className="text-lg font-medium mb-4 text-center">
        {" "}
        TAREAS NO CUMPLIDAS{" "}
      </div>
      <div className="pt-4">
        <Table hover variant="dark">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Descripcion</th>
              <th>Frecuencia</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noTareas.map((tarea) => {
              const fechaFormateada = DateTime.fromISO(
                tarea.fechaDone
              ).toFormat("dd-MM-yyyy");
              return (
                <tr key={tarea._id}>
                  <td>{tarea.task.equipo}</td>
                  <td>{tarea.task.tarea}</td>
                  <td>{tarea.task.frecuencia}</td>
                  <td>{fechaFormateada}</td>
                  <td>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleButtonClick(tarea)}
                    >
                      Ingresar Motivo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TareasNoCumplidas;
