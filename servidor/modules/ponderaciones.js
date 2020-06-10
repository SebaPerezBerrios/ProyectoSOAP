const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }) => carrera => {
  return carrera.nem * nem + carrera.ranking * ranking + carrera.matematica * matematica + carrera.lenguaje * lenguaje + carrera.ciencias_historia * Math.max(ciencias, historia);
};


const agregarMejorPonderacionHoja = (rut, ponderacionesPorCarrera) => {
  let mejorPonderacion = ponderacionesPorCarrera
    .reduce((mejorPonderacion, ponderacionActual) =>
      ((mejorPonderacion.ponderacion < ponderacionActual.ponderacion) ? ponderacionActual : mejorPonderacion),
      { ponderacion: 0 });

  mejorPonderacion.hoja.addRow([rut, mejorPonderacion.ponderacion]).commit();
}

const agregarMejorPonderacion = ({ rut, puntaje }, ponderacionesCarrera) => {
  const ponderacionPuntaje = ponderacion(puntaje);
  const ponderacionesPorCarrera = ponderacionesCarrera
    .map(carrera => ({
      ponderacion: ponderacionPuntaje(carrera.ponderaciones),
      hoja: carrera.hoja,
    }));

  agregarMejorPonderacionHoja(rut, ponderacionesPorCarrera);
}

module.exports = {
  agregarMejorPonderacion,
}