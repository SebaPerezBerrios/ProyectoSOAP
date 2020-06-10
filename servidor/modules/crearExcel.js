const Excel = require('exceljs');

const { agregarMejorPonderacion } = require('./ponderaciones');
const { parsePuntaje } = require('../utils/parser');
const { ponderacionesCarreras } = require('../utils/carreras');

const agregarRegistroExcel = (linea, ponderacionCarreras) => {
  const rutPuntajes = parsePuntaje(linea);
  agregarMejorPonderacion(rutPuntajes, ponderacionCarreras);
}

const generarExcel = async (lineas, streamSalida) => {
  const opciones = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(opciones);
  const ponderacionCarreras = await ponderacionesCarreras(book);

  for (let index = 0; index < lineas.length; index++) {
    const linea = lineas[index];
    agregarRegistroExcel(linea, ponderacionCarreras);
  }
  book.commit()
}

module.exports = {
  generarExcel
}