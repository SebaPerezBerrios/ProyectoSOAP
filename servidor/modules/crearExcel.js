const Excel = require('exceljs');

const { agregarPonderaciones } = require('./ponderaciones');
const { getDatosCarreras } = require('../utils/carreras');

const generarExcel = async (lineas, streamSalida) => {
  const opciones = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(opciones);
  const datosCarreras = await getDatosCarreras();

  agregarPonderaciones(lineas, datosCarreras);

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