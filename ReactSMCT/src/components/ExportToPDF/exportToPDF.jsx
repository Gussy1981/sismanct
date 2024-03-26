import jsPDF from "jspdf";
import { DateTime } from "luxon";

const exportToPDF = (values, dataEquipo) => {

  // Crear un nuevo documento PDF
  const doc = new jsPDF({
    orientation: "landscape",
  });
  
  // Definir la posición inicial de la tabla y el ancho de las columnas
  const x = 5; // Posición X de inicio
  const y = 65; // Posición Y de inicio
  const columnWidth = 15; // Ancho de cada columna
  const rowHeight = 5; // Altura de cada fila
  
  // Definir la posición Y inicial de la tabla
  let currentY = y;
  
  // Iterar sobre las filas y columnas y agregar los datos a la tabla
  Object.keys(values.columnas).forEach((nombreColumna, columnIndex) => {
    // Agregar encabezados de columna y líneas verticales
    doc.setLineWidth(0.1);
    //doc.rect(x + columnIndex * columnWidth, currentY, columnWidth, rowHeight, "S");
    doc.setFontSize(9);
    doc.text(values.columnas[nombreColumna][0], x + columnIndex * columnWidth + 3, currentY + 4); // Modificar texto de cabecera
    
    values.columnas[nombreColumna].forEach((fila, rowIndex) => {
      // Calcular la posición de la celda y agregar líneas horizontales
      const cellX = x + columnIndex * columnWidth;
      const cellY = currentY + 1 + rowIndex * rowHeight;
      doc.setLineWidth(0.1);
      doc.rect(cellX, cellY, columnWidth, rowHeight, "S");
      
      // Agregar los datos de la celda
      if (rowIndex > 0) { // Evitar agregar el valor de encabezado nuevamente
        doc.setFontSize(8);
        doc.text(fila, cellX + 2, cellY + 3);
      }
    });
  });

  doc.roundedRect(2, 2, 293, 206, 5, 5, "S"); //Recuadro general
  const logo = "/logo cementa grande.fw.png";
  const rutaCompleta = dataEquipo.urlImagen;
  const rutaSplit = rutaCompleta.split("\\");
  const esquema = rutaSplit[rutaSplit.length - 1];
  const fechaDoneFormated = DateTime.fromISO(values.fechaControl).toFormat("dd-MM-yyyy");
  const responsable = values.responsable;
  const aprobo = values.vistoBueno;
  const equipo = values.equipo;
  const proximaFecha = DateTime.fromISO(values.proximoControl).setLocale("es").toFormat("MMMM yyyy");
  const pirometro = values.pirometroPatron;
  const termocupla = values.termocuplaPatron;
  const observaciones = values.observaciones;
  const temperatura = String(dataEquipo.temperaturaDeTrabajo);
  const Caracteristicas = String(dataEquipo.caracteristicasDeCalentamiento);
  const lines = Caracteristicas.split('.');
  doc.addImage(logo, "PNG", 5, 5, 25, 13); //Logo Cementa
  doc.line(2, 22, 295, 22);
  doc.line(34, 2, 34, 22);
  doc.line(140, 2, 140, 22);
  doc.line(225, 2, 225, 22);
  doc.line(185, 2, 185, 22);
  doc.line(34, 8, 185, 8);
  doc.line(225, 12, 295, 12);
  doc.line(2, 30, 295, 30);
  doc.line(48, 22, 48, 30);
  doc.line(165, 62, 165, 208);
  doc.line(2, 59, 295, 59);
  doc.line(165, 59, 165, 208);
  doc.line(2, 145, 165, 145);
  doc.line(2, 152, 165, 152);
  doc.line(2, 159, 165, 159);
  doc.line(2, 166, 165, 166);
  doc.line(2, 200, 165, 200);
  doc.setFontSize(10);
  doc.text("Registro", 78, 6);
  doc.text("R-630-7", 156, 6);
  doc.text("Rev.1", 142, 13 );
  doc.text("Pagina 1 de 1", 142, 18 );
  doc.text("Fecha:", 188, 6);
  doc.setFontSize(14);
  doc.text(fechaDoneFormated, 190, 16);
  doc.setFontSize(10);
  doc.text("Controlo:", 227, 6);
  doc.setFontSize(12);
  doc.text(responsable, 244, 8);
  doc.setFontSize(10);
  doc.text("Aprobo:", 227, 16);
  doc.setFontSize(12);
  doc.text(aprobo, 244, 18);
  doc.setFontSize(14);
  doc.text("PLANILLA DE PIROMETRIA", 54, 16);
  doc.setFontSize(12);
  doc.text("Horno:", 5, 27);
  doc.text("Temperatura de Trabajo:", 51, 27);
  doc.text(temperatura, 100, 27);
  doc.text("Características de Calentamiento:", 4, 35);
  doc.setFontSize(10);
  lines.forEach((line, index) =>{
    doc.text(line, 5, 40 + (index*4));
  });
  doc.text("Pirometro Patrón:", 5, 149);
  doc.text(pirometro, 34, 149);
  doc.text("Termocupla Patrón:", 5, 156);
  doc.text(termocupla, 37, 156);
  doc.text("Precisión Indicada: +/- 5ºc", 5, 163);
  doc.text("Observaciones:", 5, 170);
  doc.text(observaciones, 32, 170);
  doc.text("Próximo Control:", 5, 204);
  doc.text(proximaFecha, 34, 204);
  doc.setFontSize(12);
  doc.text("Esquema General de Calentamiento", 197, 64);
  doc.addImage(esquema, "PNG", 190, 66, 70, 140); //Logo Cementa
  doc.setFontSize(12);
  doc.text(equipo, 18, 27);
  

  // Guardar el PDF
  doc.save("tabla.pdf");
};

export default exportToPDF;
