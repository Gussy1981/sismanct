import React from 'react'
import { useDownloadExcel } from "react-export-table-to-excel";

const ExportToExcel = ({ tableRef, filename, sheet }) => {

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: filename,
        sheet: sheet,
      });

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      onClick={onDownload}
    >
      Exportar a Excel
    </button>
  );
};

export default ExportToExcel