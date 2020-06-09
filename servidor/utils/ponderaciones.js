const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }) => carrera => {
  return carrera.nem * nem + carrera.ranking * ranking + carrera.matematica * matematica + carrera.lenguaje * lenguaje + carrera.ciencias_historia * Math.max(ciencias, historia);
};

const ponderaciones = ({ rut, puntaje }, ponderacionesCarrera) => {
  const ponderacionPuntaje = ponderacion(puntaje);
  const ponderacionesPorCarrera = ponderacionesCarrera
    .map(carrera => ({ codigo: carrera.codigo, ponderacion: ponderacionPuntaje(carrera.ponderaciones) }));

  let mejorPonderacion = 0;
  let indiceMayor = 0;

  for (let indice = 0; indice < ponderacionesPorCarrera.length; indice++) {
    const ponderacionActual = ponderacionesPorCarrera[indice];
    if (ponderacionActual.ponderacion > mejorPonderacion) {
      mejorPonderacion = ponderacionActual.ponderacion;
      indiceMayor = indice;
    }
  }
  ponderacionesPorCarrera[indiceMayor]['rut'] = rut;
  return ponderacionesPorCarrera[indiceMayor];
}

module.exports = {
  ponderaciones,
}