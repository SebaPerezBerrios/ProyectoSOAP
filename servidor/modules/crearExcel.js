const Excel = require('exceljs');

const { agregarPonderaciones } = require('./ponderaciones');
const { getDatosCarreras } = require('../utils/carreras');

const generarHoja = (book, { estado, nombreHoja, vacantes }) => {
  let hoja = book.addWorksheet(nombreHoja);
  hoja.addRow(['RUT', 'Ponderación']).commit();

  estado.postulantes
    .forEach(({ rut, ponderacion }) => {
      hoja.addRow([rut, ponderacion]).commit();
    });
}

const generarExcel = async (lineas, streamSalida) => {
  const opciones = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(opciones);
  const datosCarreras = await getDatosCarreras(book);

  await agregarPonderaciones(lineas, datosCarreras);

  datosCarreras.forEach((carrera) => generarHoja(book, carrera));
  book.commit()
}

module.exports = {
  generarExcel
}