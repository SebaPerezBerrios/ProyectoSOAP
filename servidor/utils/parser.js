const parsePuntajes = (str) => {
  const lineas = str.split(/\r?\n/);
  return lineas.filter(linea => !(linea === '')).map(parsePuntaje);
}

const parsePuntaje = (linea) => {
  const arr = linea.split(';');
  return {
    rut: arr[0], puntaje: { nem: arr[1], ranking: arr[2], matematica: arr[3], lenguaje: arr[4], ciencias: arr[5], historia: arr[6] }
  };
}

module.exports = {
  parsePuntajes
}