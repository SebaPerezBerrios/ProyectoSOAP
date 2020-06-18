/**
 * parsear CSV.
 * @param csv                     String que contiene los ruts y puntajes obtenidos separados por ";".
 * @return                        Array de ruts y puntajes obtenidos.
 */
const parseCSV = (csv) => {
  const lineas = csv.split(/\r?\n/).filter((linea) => !(linea === ""));

  return lineas.map(parsePuntaje);
};

/**
 * parsear linea del csv.
 * @param linea                   String que contiene un rut y puntajes obtenidos separados por ";".
 * @return                        rut y puntajes obtenidos.
 */
const parsePuntaje = (linea) => {
  const arr = linea.split(";");
  if (arr.length !== 7) {
    throw "CSV";
  }
  return {
    rut: parseInt(arr[0]),
    puntajes: {
      nem: parseInt(arr[1]),
      ranking: parseInt(arr[2]),
      matematica: parseInt(arr[3]),
      lenguaje: parseInt(arr[4]),
      ciencias: parseInt(arr[5]),
      historia: parseInt(arr[6]),
    },
  };
};

module.exports = {
  parseCSV,
};
