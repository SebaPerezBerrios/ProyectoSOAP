const { parseCSV } = require("../utils/parser");
const { MinPriorityQueue } = require("datastructures-js");

/**
 * Agrega los postulantes contenidos en el archivo csv y los selecciona segun su mejor opcion de postulacion en una carrera.
 * Los puntajes seleccionados se almacenan en los datos de carreras.
 *
 * @param csv                     String en formato CSV que contiene Rut y puntajes PSU separados por ";".
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 * @param log                     Logger.
 */
const seleccionarPostulantes = (csv, datosCarreras, log) => {
  const postulantes = parseCSV(csv);
  log.info("Inicio procesamiento: ", postulantes.length, " postulantes");

  agregarPostulantes(postulantes, datosCarreras);
  seleccionar(datosCarreras);
};

/**
 * Agrega los postulantes a cada carrera.
 *
 * @param postulantes             Array de postulantes (rut y puntajes obtenidos).
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 */
const agregarPostulantes = (postulantes, datosCarreras) => {
  const totalVacantesUTEM = totalVacantes(datosCarreras);

  datosCarreras.forEach((carrera) => {
    carrera.estado.postulantes = filtrarPostulantesCarrera(postulantes, carrera.ponderaciones, totalVacantesUTEM);
  });
};

/**
 * Selecciona a partir de los postulantes a cada carrera hasta que no sea posible ingresar más seleccionados.
 *
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 */
const seleccionar = (datosCarreras) => {
  let rutVistos = new Set();
  let totalVacantesActuales = totalVacantes(datosCarreras);
  let totalVacantesPrevios = null;

  while (totalVacantesActuales !== totalVacantesPrevios) {
    tomarPrimerosLugares(datosCarreras, rutVistos);

    totalVacantesPrevios = totalVacantesActuales;
    totalVacantesActuales = totalVacantes(datosCarreras);
  }
};

/**
 * Filtrar y ordenar los postulantes segun requisitos de la carrera.
 * Se considera un maximo de postulantes igual al numero total de vacantes de la universidad
 * La explicación de este diseño esta en el informe.
 *
 * @param postulantes             Array de postulantes (rut y puntajes obtenidos).
 * @param ponderacionCarrera      Porcentajes de ponderacion de carrera.
 * @param totalVacantesUTEM       Total de vacantes a nivel universidad.
 *
 * @return                        Array de postulantes preseleccionados.
 */
const filtrarPostulantesCarrera = (postulantes, ponderacionCarrera, totalVacantesUTEM) => {
  let mejoresPostulantes = new MinPriorityQueue();
  postulantes.forEach(({ rut, puntajes }) => {
    if ((puntajes.lenguaje + puntajes.matematica) / 2 >= ponderacionCarrera.mininoLenguajeMatematica) {
      mejoresPostulantes.enqueue(rut, ponderacion(puntajes, ponderacionCarrera));
      if (mejoresPostulantes.size() > totalVacantesUTEM) {
        mejoresPostulantes.dequeue();
      }
    }
  });
  return mejoresPostulantes.toArray();
};

/**
 * Seleccionar los mejores postulantes restantes de cada carrera por posicion.
 * Los seleccionados se agregan a las carreras y se actualiza cantidad de vacantes restantes.
 *
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 * @param rutVistos               Set de ruts seleccionados previamente.
 *
 */
const tomarPrimerosLugares = (datosCarreras, rutVistos) => {
  let primerosPuntajes = new Map();

  datosCarreras.forEach((carrera, index) => {
    if (carrera.estado.vacantes !== 0) {
      agregarSeleccionado(carrera, index, rutVistos, primerosPuntajes);
    }
  });

  for (const { index, rut, ponderacion } of primerosPuntajes.values()) {
    datosCarreras[index].estado.seleccionados.push({
      rut: rut,
      ponderacion: ponderacion,
    });
    --datosCarreras[index].estado.vacantes;
    rutVistos.add(rut);
  }
};

/**
 * Agregar al siguiente seleccionado de la carrera.
 * En caso de existir otra carrera a a la cual postula en la misma posicion se elije la que tenga mejor puntaje de ponderacion.
 *
 * @param carrera                 datos de carrera, postulantes y seleccionados.
 * @param index                   indice de la carrera, se usa para almacenar la carrera con mayor puntaje de ponderacion.
 * @param rutVistos               Set de ruts seleccionados previamente.
 * @param primerosPuntajes        Map de ruts y puntajes. corresponde a la n-esima posicion de las carreras.
 *
 */
const agregarSeleccionado = (carrera, index, rutVistos, primerosPuntajes) => {
  popWhile(carrera.estado.postulantes, rutVisto(rutVistos));
  if (carrera.estado.postulantes.length === 0) return;

  const { element, priority } = carrera.estado.postulantes.pop();
  let mejorPonderacionActual = {
    rut: element,
    ponderacion: priority,
    posicion: carrera.estado.seleccionados.length,
    index: index,
  };

  const previaMejorPonderacion = primerosPuntajes.get(mejorPonderacionActual.rut);

  if (previaMejorPonderacion !== undefined) {
    const mejorPonderacion = ponderacionMayor(mejorPonderacionActual, previaMejorPonderacion);
    primerosPuntajes.set(mejorPonderacionActual.rut, mejorPonderacion);
  } else {
    primerosPuntajes.set(mejorPonderacionActual.rut, mejorPonderacionActual);
  }
};

/**
 * Ponderar un puntaje con las ponderaciones de una carrera.
 *
 * @param puntajes                putnajes obtenidos por un rut.
 * @param carrera                 ponderaciones de carrera.
 *
 * @return                        ponderacion.
 */
const ponderacion = ({ nem, ranking, matematica, lenguaje, ciencias, historia }, carrera) => {
  return (
    carrera.nem * nem +
    carrera.ranking * ranking +
    carrera.matematica * matematica +
    carrera.lenguaje * lenguaje +
    carrera.ciencias_historia * Math.max(ciencias, historia)
  );
};

/**
 * Eliminar elementos de un Array mientras se cumpla la condicion.
 * Se usa para eliminar postulantes de carreras que ya han sido seleccionados.
 *
 * @param arr                     Array de datos.
 * @param cond                    condicion en caso de verdadera eliminar el elemento.
 *
 */
const popWhile = (arr, cond) => {
  while (true) {
    if (arr.length === 0) return;
    const elem = arr[arr.length - 1];
    if (!cond(elem)) {
      return;
    }
    arr.pop();
  }
};

const rutVisto = (rutVistos) => (elem) => rutVistos.has(elem.element);

/**
 * obtener la mejor de dos ponderaciones(rut, ponderacion, indeice carrera asociado) basado en el puntaje ponderado
 */
const ponderacionMayor = (ponderacionA, ponderacionB) => {
  if (ponderacionA.posicion < ponderacionB.posicion) return ponderacionA;
  if (ponderacionA.posicion > ponderacionB.posicion) return ponderacionB;
  return ponderacionA.ponderacion > ponderacionB.ponderacion ? ponderacionA : ponderacionB;
};

/**
 * Obtener el total de vacantes restantes de la universidad.
 *
 * @param datosCarreras           Array de datos de carreras, postulantes y seleccionados.
 *
 * @return                        Cantidad de vacantes de la universidad.
 */
const totalVacantes = (datosCarreras) => {
  let suma = 0;
  datosCarreras.forEach((carrera) => {
    suma += carrera.estado.vacantes;
  });
  return suma;
};

module.exports = {
  seleccionarPostulantes,
};
