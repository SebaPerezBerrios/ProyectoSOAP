const { parsePuntaje } = require('../utils/parser');

const agregarPonderaciones = (lineas, datosCarreras) => {
  agregarPostulantes(lineas, datosCarreras);

  seleccionar(datosCarreras);

}

const agregarPostulantes = (lineas, datosCarreras) => {
  const totalVacantesUTEM = totalVacantes(datosCarreras);
  lineas.forEach(linea => {
    const rutPuntajes = parsePuntaje(linea);
    agregarPostulanteCarrera(rutPuntajes, datosCarreras, totalVacantesUTEM);
  });
  datosCarreras.forEach(carrera => {
    carrera.estado.postulantes = carrera.estado.postulantes.toArray();
  });
}

const seleccionar = (datosCarreras) => {
  let rutVistos = new Set();
  let totalVacantesActuales = totalVacantes(datosCarreras);
  let totalVacantesPrevios = null;

  while (totalVacantesActuales !== totalVacantesPrevios) {
    tomarPrimerosLugares(datosCarreras, rutVistos);

    totalVacantesPrevios = totalVacantesActuales;
    totalVacantesActuales = totalVacantes(datosCarreras);
  }
}

const agregarPostulanteCarrera = (rutPuntajes, datosCarreras, totalVacantesUTEM) => {
  const ponderacionPuntaje = ponderacion(rutPuntajes.puntajes);
  datosCarreras.forEach(carrera => {
    carrera.estado.postulantes.enqueue(rutPuntajes.rut, ponderacionPuntaje(carrera.ponderaciones));
    if (carrera.estado.postulantes.size() > totalVacantesUTEM) {
      carrera.estado.postulantes.dequeue();
    }
  });
}

const tomarPrimerosLugares = (datosCarreras, rutVistos) => {
  let primerosPuntajes = new Map();

  for (let index = 0; index < datosCarreras.length; index++) {
    const carrera = datosCarreras[index];
    if (carrera.estado.vacantes !== 0) {
      agregarSeleccionado(carrera, index, rutVistos, primerosPuntajes);
    }
  }

  for (const { index, rut, ponderacion } of primerosPuntajes.values()) {
    datosCarreras[index].estado.seleccionados.push({ rut: rut, ponderacion: ponderacion });
    --datosCarreras[index].estado.vacantes;
    rutVistos.add(rut);
  }
}

const agregarSeleccionado = (carrera, index, rutVistos, primerosPuntajes) => {
  popWhile(carrera.estado.postulantes, rutVisto(rutVistos));
  if (carrera.estado.postulantes.length === 0) return;

  const { element, priority } = carrera.estado.postulantes.pop();
  let mejorPonderacionActual = { rut: element, ponderacion: priority, index: index };

  const previaMejorPonderacion = primerosPuntajes.get(mejorPonderacionActual.rut);

  if (previaMejorPonderacion !== undefined) {
    const mejorPonderacion = ponderacionMayor(mejorPonderacionActual, previaMejorPonderacion);
    primerosPuntajes.set(mejorPonderacionActual.rut, mejorPonderacion);
  }
  else {
    primerosPuntajes.set(mejorPonderacionActual.rut, mejorPonderacionActual);
  }
}

const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }) => carrera => {
  return carrera.nem * nem + carrera.ranking * ranking + carrera.matematica * matematica + carrera.lenguaje * lenguaje + carrera.ciencias_historia * Math.max(ciencias, historia);
};

const popWhile = (arr, cond) => {
  while (true) {
    if (arr.length === 0) return;
    const elem = arr[arr.length - 1];
    if (!cond(elem)) {
      return;
    }
    arr.pop();
  }
}

const rutVisto = (rutVistos) => (elem) => (rutVistos.has(elem.element));

const ponderacionMayor = (ponderacionA, ponderacionB) =>
  ((ponderacionA.ponderacion > ponderacionB.ponderacion) ? ponderacionA : ponderacionB)

const totalVacantes = (datosCarreras) => {
  let suma = 0;
  datosCarreras.forEach(carrera => {
    suma += carrera.estado.vacantes;
  })
  return suma;
}

module.exports = {
  agregarPonderaciones,
}