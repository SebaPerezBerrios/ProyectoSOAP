const Excel = require('exceljs');

const { ponderaciones } = require('../utils/ponderaciones');
const { parsePuntajes } = require('../utils/parser');
const { crearHojasCarreras } = require('../utils/carreras');

const agregarPonderacion = ({ codigo, rut, ponderacion }, carreras) => {
  const posicionHoja = ++carreras[codigo].posicion;
  let hoja = carreras[codigo].hoja;
  hoja.getCell('A' + posicionHoja.toString()).value = rut;
  hoja.getCell('B' + posicionHoja.toString()).value = ponderacion;
}

const llenarExcel = (lineas, carreras) => {
  const puntajes = parsePuntajes(lineas);
  puntajes.forEach((rutPuntaje) => {
    agregarPonderacion(ponderaciones(rutPuntaje), carreras);
  });
}

const agregarEncabezados = (carreras) => {
  Object.values(carreras).forEach(({ hoja, _ }) => {
    hoja.getCell('A1').value = 'RUT';
    hoja.getCell('B1').value = 'Ponderación';
  });
}

const generarExcel = (lineas) => {
  let book = new Excel.Workbook();
  const carreras = crearHojasCarreras(book);
  agregarEncabezados(carreras);
  llenarExcel(lineas, carreras);
  return book;
}

module.exports = {
  generarExcel
}