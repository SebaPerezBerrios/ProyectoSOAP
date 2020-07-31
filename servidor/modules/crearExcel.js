const Excel = require("exceljs");

/**
 * Genera un archivo excel en el stream de salida con los datos de los postulantes (rut y ponderacion) por carrera.
 *
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 * @param streamSalida            Stream donde se genera el archivo excel
 */
const generarExcel = (datosCarreras, streamSalida) => {
  const opciones = {
    stream: streamSalida,
  };
  let book = new Excel.stream.xlsx.WorkbookWriter(opciones);
  datosCarreras.forEach((carrera) => generarHojaCarrera(carrera, book));
  book.commit();
};

/**
 * Genera las hojas del libro excel asociadas a cada carrera y las llena con los ruts y puntajes seleccionados.
 *
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 * @param book                    Libro excel a ser llenado.
 */
const generarHojaCarrera = ({ seleccionados, nombreHoja }, book) => {
  let hoja = book.addWorksheet(nombreHoja);
  hoja.addRow(["RUT", "Ponderación"]).commit();

  seleccionados.forEach(({ rut, ponderacion }) => {
    hoja.addRow([rut, ponderacion]).commit();
  });
};

module.exports = {
  generarExcel,
};
