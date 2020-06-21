#ifndef Ponderaciones
#define Ponderaciones

#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "lib/Parser.h"

void ponderaciones(const std::string &, Carreras &);
void agregarPostulantes(const std::vector<RutPuntajes> &, Carreras &);
size_t totalVacantes(const Carreras &);
Postulantes filtrarPostulantesCarrera(const std::vector<RutPuntajes> &, const Ponderacion &, size_t);
Postulantes toArray(priority_queue_postulante &);
void seleccionar(Carreras &);
void tomarPrimerosLugares(Carreras &, std::unordered_set<long> &);
void agregarSeleccionado(Carrera &, const std::unordered_set<long> &, std::unordered_map<long, PonderacionCarrera> &);
void quitarRutsVistos(Postulantes &, const std::unordered_set<long> &);
PonderacionCarrera mejorPonderacion(const PonderacionCarrera &, const PonderacionCarrera &);
double ponderacion(const Puntajes &, const Ponderacion &);

void ponderaciones(const std::string &csv, Carreras &carreras) {
  auto resultado = parseCSV(csv);
  agregarPostulantes(resultado, carreras);
  seleccionar(carreras);
}

void agregarPostulantes(const std::vector<RutPuntajes> &rutsPuntajes, Carreras &carreras) {
  auto totalVacantesUTEM = totalVacantes(carreras);
  for (auto &carrera : carreras) {
    carrera.estado.postulantes = filtrarPostulantesCarrera(rutsPuntajes, carrera.ponderacion, totalVacantesUTEM);
  }
}

Postulantes filtrarPostulantesCarrera(const std::vector<RutPuntajes> &rutsPuntajes,
                                      const Ponderacion &ponderacionCarrera, size_t totalVacantesUTEM) {
  priority_queue_postulante mejoresPostulantes;
  for (const auto &rutPuntaje : rutsPuntajes) {
    mejoresPostulantes.push({rutPuntaje.rut, ponderacion(rutPuntaje.puntajes, ponderacionCarrera)});
    if (mejoresPostulantes.size() > totalVacantesUTEM) {
      mejoresPostulantes.pop();
    }
  }
  return toArray(mejoresPostulantes);
}

void seleccionar(Carreras &carreras) {
  std::unordered_set<long> rutsIngresados;
  auto vacantesActuales = totalVacantes(carreras);
  size_t vacantesPrevias = 0;

  while (vacantesActuales != vacantesPrevias) {
    tomarPrimerosLugares(carreras, rutsIngresados);
    vacantesPrevias = vacantesActuales;
    vacantesActuales = totalVacantes(carreras);
  }
}

void tomarPrimerosLugares(Carreras &carreras, std::unordered_set<long> &rutsIngresados) {
  std::unordered_map<long, PonderacionCarrera> primerosPuntajes;
  for (auto &carrera : carreras) {
    if (carrera.estado.vacantes != 0) {
      agregarSeleccionado(carrera, rutsIngresados, primerosPuntajes);
    }
  }

  for (const auto &rutPonderacion : primerosPuntajes) {
    (*rutPonderacion.second.carreraAsociada)
        .estado.seleccionados.push_back({rutPonderacion.first, rutPonderacion.second.ponderacion});
    --(*rutPonderacion.second.carreraAsociada).estado.vacantes;
    rutsIngresados.insert(rutPonderacion.first);
  }
}

void agregarSeleccionado(Carrera &carrera, const std::unordered_set<long> &rutsIngresados,
                         std::unordered_map<long, PonderacionCarrera> &primerosPuntajes) {
  quitarRutsVistos(carrera.estado.postulantes, rutsIngresados);
  if (carrera.estado.postulantes.size() == 0) return;

  auto mejorPostulante = carrera.estado.postulantes.back();
  carrera.estado.postulantes.pop_back();

  PonderacionCarrera mejorPonderacionActual{carrera.estado.seleccionados.size(), carrera.ultimoMatriculado,
                                            carrera.cupos, mejorPostulante.ponderacion, &carrera};

  auto resultado = primerosPuntajes.insert({mejorPostulante.rut, mejorPonderacionActual});
  // existe elemento previamente
  if (!resultado.second) {
    resultado.first->second = mejorPonderacion(resultado.first->second, mejorPonderacionActual);
  }
}

void quitarRutsVistos(Postulantes &postulantes, const std::unordered_set<long> &rutsIngresados) {
  while (true) {
    if (postulantes.size() == 0) return;
    auto postulante = postulantes.back();
    if (rutsIngresados.find(postulante.rut) == rutsIngresados.end()) {
      return;
    }
    postulantes.pop_back();
  }
}

PonderacionCarrera mejorPonderacion(const PonderacionCarrera &lhs, const PonderacionCarrera &rhs) {
  // preferencias de carrera

  if (lhs.posicion < rhs.posicion) return lhs;
  if (lhs.posicion > rhs.posicion) return rhs;

  if (lhs.ultimoMatriculado > rhs.ultimoMatriculado) return lhs;
  if (lhs.ultimoMatriculado < rhs.ultimoMatriculado) return rhs;

  return (lhs.cupos < rhs.cupos) ? lhs : rhs;
}

size_t totalVacantes(const Carreras &carreras) {
  size_t suma = 0;
  for (const auto &carrera : carreras) {
    suma += carrera.estado.vacantes;
  }
  return suma;
}

Postulantes toArray(priority_queue_postulante &mejoresPostulantes) {
  Postulantes array;
  array.reserve(mejoresPostulantes.size());
  while (mejoresPostulantes.size() != 0) {
    array.push_back(mejoresPostulantes.top());
    mejoresPostulantes.pop();
  }
  return array;
}

double ponderacion(const Puntajes &puntajes, const Ponderacion &ponderacion) {
  return puntajes.nem * ponderacion.nem + puntajes.ranking * ponderacion.ranking +
         puntajes.matematica * ponderacion.matematica + puntajes.lenguaje * ponderacion.lenguaje +
         std::max(puntajes.ciencias, puntajes.historia) * ponderacion.ciencias_historia;
}

#endif