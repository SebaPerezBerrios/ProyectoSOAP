const Excel = require('exceljs');

const { ponderaciones } = require('../utils/ponderaciones');
const { parsePuntaje } = require('../utils/parser');
const { crearHojasCarreras, ponderacionesCarreras } = require('../utils/carreras');

const agregarPonderacion = ({ codigo, rut, ponderacion }, carreras) => {
  let hoja = carreras[codigo];
  hoja.addRow([rut, ponderacion]).commit();
}

const agregarRegistroExcel = (linea, carreras, ponderacionCarreras) => {
  const rutPuntaje = parsePuntaje(linea);
  const ponderacionRutPuntaje = ponderaciones(rutPuntaje, ponderacionCarreras);

  agregarPonderacion(ponderacionRutPuntaje, carreras);
}

const agregarEncabezados = (carreras) => {
  Object.values(carreras).forEach((hoja) => {
    hoja.addRow(['RUT', 'Ponderacion']).commit();
  });
}

const generarExcel = async (lineas, streamSalida) => {
  const options = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(options);
  const carreras = await crearHojasCarreras(book);
  const ponderacionCarreras = await ponderacionesCarreras();

  agregarEncabezados(carreras);
  for (let index = 0; index < lineas.length; index++) {
    const linea = lineas[index];
    agregarRegistroExcel(linea, carreras, ponderacionCarreras);
  }
  book.commit()
}

module.exports = {
  generarExcel
}