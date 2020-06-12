const { parsePuntaje } = require('../utils/parser');

const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }) => carrera => {
  return carrera.nem * nem + carrera.ranking * ranking + carrera.matematica * matematica + carrera.lenguaje * lenguaje + carrera.ciencias_historia * Math.max(ciencias, historia);
};

const agregarPonderacion = (rutPuntajes, carrera) => {
  const ponderacionPuntaje = ponderacion(rutPuntajes.puntajes)(carrera.ponderaciones);
  carrera.estado.postulantes.push({ rut: rutPuntajes.rut, ponderacion: ponderacionPuntaje });
}

const procesarPostulantes = (datosCarreras) => {
  datosCarreras.forEach(carrera => {
    carrera.estado.postulantes = carrera.estado.postulantes
      .sort((a, b) => b.ponderacion - a.ponderacion)
      .slice(0, carrera.vacantes)
  });
}

const agregarPonderaciones = (lineas, datosCarreras) => {
  let index = 0;
  const cantidadCarreras = datosCarreras.length;

  lineas.forEach(linea => {
    const carrera = datosCarreras[index++];
    if (index == cantidadCarreras) index = 0;

    const rutPuntajes = parsePuntaje(linea);
    agregarPonderacion(rutPuntajes, carrera);
  });

  procesarPostulantes(datosCarreras);
}

module.exports = {
  agregarPonderaciones,
}