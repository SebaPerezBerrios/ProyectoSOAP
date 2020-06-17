const Excel = require('exceljs');

const generarExcel = (datosCarreras, streamSalida) => {
  const opciones = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(opciones);
  datosCarreras.forEach((carrera) => generarHojaCarrera(book, carrera));
  book.commit();
}

const generarHojaCarrera = (book, { estado, nombreHoja }) => {
  let hoja = book.addWorksheet(nombreHoja);
  hoja.addRow(['RUT', 'Ponderación']).commit();

  estado.seleccionados
    .forEach(({ rut, ponderacion }) => {
      hoja.addRow([rut, ponderacion]).commit();
    });
}

module.exports = {
  generarExcel
}