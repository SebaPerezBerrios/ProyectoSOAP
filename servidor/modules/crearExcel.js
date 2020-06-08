const Excel = require('exceljs');

const { ponderaciones } = require('../utils/ponderaciones');
const { parsePuntaje } = require('../utils/parser');
const { crearHojasCarreras } = require('../utils/carreras');

const agregarPonderacion = ({ codigo, rut, ponderacion }, carreras) => {
  const posicionHoja = ++carreras[codigo].posicion;
  let hoja = carreras[codigo].hoja;
  hoja.addRow([rut, ponderacion]).commit();
}

const llenarExcel = (linea, carreras) => {
  const rutPuntaje = parsePuntaje(linea);
  agregarPonderacion(ponderaciones(rutPuntaje), carreras);
}

const agregarEncabezados = (carreras) => {
  Object.values(carreras).forEach(({ hoja, _ }) => {
    hoja.addRow(['RUT', 'Ponderacion']).commit();
  });
}

const generarExcel = (lineas, streamSalida) => {
  const options = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(options);
  const carreras = crearHojasCarreras(book);
  agregarEncabezados(carreras);
  lineas.forEach(linea => llenarExcel(linea, carreras));
  book.commit()
}

module.exports = {
  generarExcel
}