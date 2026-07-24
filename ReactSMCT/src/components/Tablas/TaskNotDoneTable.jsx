import { useRef } from "react";
import { DataTable } from "mantine-datatable";
import ExportToExcel from "../ExportToExcel/ExportToExcel";
import { DateTime } from "luxon";

const TaskNotDoneTable = ({ taskNotDone }) => {
  const tableRef = useRef(null);

  const columns = [
    {
      accessor: "fechaDone", title: "Programado",
      render: ({ fechaDone }) => DateTime.fromISO(fechaDone).toFormat("dd-MM-yyyy"),
    },
    { accessor: "task.equipo",    title: "Equipo" },
    { accessor: "task.tarea",     title: "Tarea" },
    { accessor: "task.encargado", title: "Responsable" },
    { accessor: "motivo",         title: "Motivo" },
  ];

  return (
    <>
      <div className="py-3">
        <ExportToExcel tableRef={tableRef} filename="Tabla_preventivo_no_cumplido" sheet="Preventivo" />
      </div>
      <DataTable
        columns={columns}
        records={taskNotDone.taskNotdone ?? []}
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={150}
        noRecordsText="No hay tareas no cumplidas"
        tableProps={{ ref: tableRef }}
      />
    </>
  );
};

export default TaskNotDoneTable;
