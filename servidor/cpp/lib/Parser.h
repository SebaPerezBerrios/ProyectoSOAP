#include <iostream>
#include <vector>

#include "Structs.h"

RutPuntajes parsePuntaje(std::string::const_iterator&);
long parseRut(std::string::const_iterator&);
unsigned int parseNumero(std::string::const_iterator&);
void parsePuntoComa(std::string::const_iterator&);
void parseFinLinea(std::string::const_iterator&);

std::vector<RutPuntajes> parseCSV(const std::string& csv) {
  std::string::const_iterator iterador = csv.begin();
  std::vector<RutPuntajes> resultado;
  while (true) {
    try {
      resultado.emplace_back(parsePuntaje(iterador));
      parseFinLinea(iterador);
    } catch (...) {
      return resultado;
    }
  }
}

RutPuntajes parsePuntaje(std::string::const_iterator& iterador) {
  auto rut = parseRut(iterador);
  parsePuntoComa(iterador);
  auto nem = parseNumero(iterador);
  parsePuntoComa(iterador);
  auto ranking = parseNumero(iterador);
  parsePuntoComa(iterador);
  auto matematica = parseNumero(iterador);
  parsePuntoComa(iterador);
  auto lenguaje = parseNumero(iterador);
  parsePuntoComa(iterador);
  auto ciencias = parseNumero(iterador);
  parsePuntoComa(iterador);
  auto historia = parseNumero(iterador);
  return RutPuntajes{rut, {nem, ranking, matematica, lenguaje, ciencias, historia}};
}

long parseRut(std::string::const_iterator& iterador) { return (long)parseNumero(iterador); }

unsigned int parseNumero(std::string::const_iterator& iterador) {
  if (*iterador == ';' || *iterador == '\0' || *iterador == '\n' || *iterador == '\r') {
    throw "Se esperaba numero";
  }
  unsigned int resultado = 0;
  while (*iterador != ';' && *iterador != '\0' && *iterador != '\n' && *iterador != '\r') {
    resultado = resultado * 10 + (*iterador++ - '0');
  }
  return resultado;
}

void parsePuntoComa(std::string::const_iterator& iterador) {
  if (*iterador != ';') {
    throw "Se esperaba ';'";
  }
  ++iterador;
}

void parseFinLinea(std::string::const_iterator& iterador) {
  if (*iterador != '\n' && *iterador != '\0' && *iterador != '\r') {
    throw "Se esperaba fin linea";
  }
  ++iterador;
}