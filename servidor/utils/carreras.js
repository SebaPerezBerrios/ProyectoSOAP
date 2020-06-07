//TODO leer datos de carreras de base de datos (usar proyecto REST paralela como referencia)
let datosCarreras =
  [{ codigo: 21041, ponderaciones: { nem: 0.1, ranking: 0.2, matematica: 0.4, lenguaje: 0.2, ciencias_historia: 0.1 } }
    , { codigo: 21040, ponderaciones: { nem: 0.2, ranking: 0.2, matematica: 0.3, lenguaje: 0.2, ciencias_historia: 0.1 } }
  ]

const crearHojasCarreras = (book) => {
  return ({
    21041: { hoja: book.addWorksheet('Ing Civil Compu'), posicion: 1 },
    21040: { hoja: book.addWorksheet('Ing Inf'), posicion: 1 },
  });
}

module.exports = {
  datosCarreras,
  crearHojasCarreras
}