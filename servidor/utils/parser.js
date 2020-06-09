const parsePuntaje = (linea) => {
  const arr = linea.split(';');
  if (arr.length !== 7) {
    throw 'CSV';
  }
  return {
    rut: arr[0], puntaje: { nem: arr[1], ranking: arr[2], matematica: arr[3], lenguaje: arr[4], ciencias: arr[5], historia: arr[6] }
  };
}

module.exports = {
  parsePuntaje
}