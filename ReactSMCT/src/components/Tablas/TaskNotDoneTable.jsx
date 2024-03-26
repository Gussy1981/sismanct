import React, {  useRef } from "react";
import { Table } from "react-bootstrap";
import ExportToExcel from '../ExportToExcel/ExportToExcel';
import { DateTime } from "luxon";

const TaskNotDoneTable = ({taskNotDone}) => {
    console.log("Desde Tabla", taskNotDone.taskNotdone)
    const tableRef = useRef(null);
  return (
    <>
    <div className="py-3">
      <ExportToExcel tableRef={tableRef} filename="Tabla_preventivo_no_cumplido" sheet="Preventivo"/>
    </div>
    <Table ref={tableRef} hover variant="dark">
              <thead>
                <tr>
                  <th>Programado</th>
                  <th>Equipo</th>
                  <th>Tarea</th>
                  <th>Responsable</th>
                  <th>Motivo</th>
                  
                </tr>
              </thead>
              <tbody>
                {taskNotDone.taskNotdone &&
                  taskNotDone.taskNotdone.map((task) => {
                    const fechaFormateada = DateTime.fromISO(
                      task.fechaDone
                    ).toFormat("dd-MM-yyyy");
                    return (
                      <tr key={task._id}>
                        <td>{fechaFormateada}</td>
                        <td>{task.task.equipo}</td>
                        <td>{task.task.tarea}</td>
                        <td>{task.task.encargado}</td>
                        <td>{task.motivo}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
    </>
  )
}

export default TaskNotDoneTable