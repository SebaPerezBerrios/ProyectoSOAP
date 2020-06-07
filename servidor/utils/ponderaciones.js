const { datosCarreras } = require('./carreras');

const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }) => carrera => {
  return carrera.nem * nem + carrera.ranking * ranking + carrera.matematica * matematica + carrera.lenguaje * lenguaje + carrera.ciencias_historia * Math.max(ciencias, historia);
};

const ponderaciones = ({ rut, puntaje }) => {
  const ponderacionPuntaje = ponderacion(puntaje);
  const ponderacionesCarrera = datosCarreras
    .map(carrera => ({ codigo: carrera.codigo, ponderacion: ponderacionPuntaje(carrera.ponderaciones) }));
  let mejorPonderacion = ponderacionesCarrera.reduce(mayorPonderacion, { ponderacion: 0 });
  mejorPonderacion['rut'] = rut;
  return mejorPonderacion;
}

const mayorPonderacion = (a, b) => a.ponderacion < b.ponderacion ? b : a;

module.exports = {
  ponderaciones,
}