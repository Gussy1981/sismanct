import jsPDF from "jspdf";
import { DateTime } from "luxon";

const exportToPDF = (values, dataEquipo) => {

  // Crear un nuevo documento PDF
  const doc = new jsPDF({
    orientation: "landscape",
  });
  
  // Posición inicial de la tabla
  const x = 5; // Posición X de inicio
  const y = 65; // Posición Y de inicio
  const cellPadding = 2;
  const headerFontSize = 9;
  const dataFontSize = 8;

  const columnasKeys = Object.keys(values.columnas);
  const numColumnas = columnasKeys.length;
  const numFilas = numColumnas ? values.columnas[columnasKeys[0]].length : 0;

  // Ancho de columna: se reparte el ancho disponible de la tabla (hasta el
  // esquema general de calentamiento, en x=165) entre la cantidad real de
  // columnas, con un mínimo/máximo razonable para que no queden ni
  // demasiado angostas (pocas columnas) ni demasiado anchas (muchas columnas)
  const tableAreaWidth = 158;
  const minColumnWidth = 15;
  const maxColumnWidth = 40;
  const columnWidth = numColumnas
    ? Math.min(maxColumnWidth, Math.max(minColumnWidth, tableAreaWidth / numColumnas))
    : minColumnWidth;

  // Alto de fila: se calcula por fila según la cantidad de líneas que
  // necesite el texto más largo de esa fila una vez ajustado (wrap) al
  // ancho de columna, así el texto nunca se sale de la celda
  const rowHeights = [];
  for (let rowIndex = 0; rowIndex < numFilas; rowIndex++) {
    doc.setFontSize(rowIndex === 0 ? headerFontSize : dataFontSize);
    let maxLineas = 1;
    columnasKeys.forEach((nombreColumna) => {
      const texto = String(values.columnas[nombreColumna][rowIndex] ?? "");
      const lineas = doc.splitTextToSize(texto, columnWidth - cellPadding * 2);
      maxLineas = Math.max(maxLineas, lineas.length);
    });
    // getLineHeight() devuelve el valor en puntos tipográficos (pt), no en
    // la unidad del documento (mm) -> hay que convertirlo con scaleFactor
    const lineHeightMm = doc.getLineHeight() / doc.internal.scaleFactor;
    rowHeights.push(Math.max(5, maxLineas * lineHeightMm + 2));
  }

  // Dibujar la grilla: bordes de celda + texto ajustado (wrap) a la columna
  columnasKeys.forEach((nombreColumna, columnIndex) => {
    const cellX = x + columnIndex * columnWidth;
    let cellY = y;

    values.columnas[nombreColumna].forEach((valor, rowIndex) => {
      const rowHeight = rowHeights[rowIndex];

      doc.setLineWidth(0.1);
      doc.rect(cellX, cellY, columnWidth, rowHeight, "S");

      doc.setFontSize(rowIndex === 0 ? headerFontSize : dataFontSize);
      const texto = String(valor ?? "");
      const lineas = doc.splitTextToSize(texto, columnWidth - cellPadding * 2);
      doc.text(lineas, cellX + cellPadding, cellY + cellPadding + 1.5);

      cellY += rowHeight;
    });
  });

  doc.roundedRect(2, 2, 293, 206, 5, 5, "S"); //Recuadro general
  const logo = "/logo cementa grande.fw.png";
  const rutaCompleta = dataEquipo.urlImagen;
  // Imagenes nuevas quedan en /uploads/... (servido aparte del build); las
  // imagenes viejas guardaron un path de filesystem crudo, del que solo
  // podemos usar el nombre de archivo (queda en la raíz del build)
  const esquema = rutaCompleta.startsWith("/uploads/")
    ? rutaCompleta
    : "/" + rutaCompleta.split(/[\\/]/).pop();
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

  // Encuadrar el esquema respetando su relación de aspecto real, para que no
  // quede estirado dentro del recuadro de 70x140mm reservado para la imagen
  const esquemaBoxX = 170, esquemaBoxY = 66, esquemaBoxWidth = 120, esquemaBoxHeight = 140;
  const esquemaProps = doc.getImageProperties(esquema);
  const esquemaRatio = esquemaProps.width / esquemaProps.height;
  const boxRatio = esquemaBoxWidth / esquemaBoxHeight;

  let esquemaDrawWidth, esquemaDrawHeight;
  if (esquemaRatio > boxRatio) {
    esquemaDrawWidth = esquemaBoxWidth;
    esquemaDrawHeight = esquemaBoxWidth / esquemaRatio;
  } else {
    esquemaDrawHeight = esquemaBoxHeight;
    esquemaDrawWidth = esquemaBoxHeight * esquemaRatio;
  }
  const esquemaX = esquemaBoxX + (esquemaBoxWidth - esquemaDrawWidth) / 2;
  const esquemaY = esquemaBoxY + (esquemaBoxHeight - esquemaDrawHeight) / 2;

  doc.addImage(esquema, "PNG", esquemaX, esquemaY, esquemaDrawWidth, esquemaDrawHeight);
  doc.setFontSize(12);
  doc.text(equipo, 18, 27);
  

  // Guardar el PDF con nombre identificable: <equipo>_<mes>_<año>.pdf
  const mesControl = DateTime.fromISO(values.fechaControl).setLocale("es").toFormat("MMMM_yyyy");
  const nombreArchivo = `${equipo}_${mesControl}.pdf`;
  doc.save(nombreArchivo);
};

export default exportToPDF;
