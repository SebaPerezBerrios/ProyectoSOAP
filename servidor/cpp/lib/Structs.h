#ifndef Structs
#define Structs

#include <queue>
#include <vector>

struct Puntajes {
  unsigned int nem;
  unsigned int ranking;
  unsigned int matematica;
  unsigned int lenguaje;
  unsigned int ciencias;
  unsigned int historia;
};

struct RutPuntajes {
  long rut;
  Puntajes puntajes;
};

struct Postulante {
  long rut;
  double ponderacion;
};

struct Ponderacion {
  double nem;
  double ranking;
  double matematica;
  double lenguaje;
  double ciencias_historia;
};

struct Estado {
  std::vector<Postulante> postulantes;
  std::vector<Postulante> seleccionados;
  long vacantes;
};

struct Carrera {
  Ponderacion ponderacion;
  long cupos;
  double ultimoMatriculado;
  Estado estado;
  Carrera(const Ponderacion &_ponderacion, long _vacantes, double _ultimoMatriculado) {
    ponderacion = _ponderacion;
    cupos = _vacantes;
    ultimoMatriculado = _ultimoMatriculado;
    estado = {std::vector<Postulante>(), std::vector<Postulante>(), _vacantes};
  }
};

struct ComparadorPostulante {
  bool operator()(const Postulante &lhs, const Postulante &rhs) { return lhs.ponderacion > rhs.ponderacion; }
};

struct PonderacionCarrera {
  // criterios de seleccion de carrera
  size_t posicion;
  double ultimoMatriculado;
  long cupos;
  double ponderacion;
  Carrera *carreraAsociada;
};

using Postulantes = std::vector<Postulante>;
using Carreras = std::vector<Carrera>;
using priority_queue_postulante = std::priority_queue<Postulante, std::vector<Postulante>, ComparadorPostulante>;

#endif