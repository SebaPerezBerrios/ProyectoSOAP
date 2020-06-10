const parsePuntaje = (linea) => {
  const arr = linea.split(';');
  if (arr.length !== 7) {
    throw 'CSV';
  }
  return {
    rut: arr[0],
    puntaje: {
      nem: parseInt(arr[1]),
      ranking: parseInt(arr[2]),
      matematica: parseInt(arr[3]),
      lenguaje: parseInt(arr[4]),
      ciencias: parseInt(arr[5]),
      historia: parseInt(arr[6]),
    }
  };
}

module.exports = {
  parsePuntaje
}