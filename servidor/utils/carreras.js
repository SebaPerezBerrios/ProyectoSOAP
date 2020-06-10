const { Pool } = require('pg');

const pool = new Pool();

let ponderacionesCarreras = async (book) => {
  const { rows } = await pool.query("SELECT * FROM carreras_2020", []).catch(err => { throw 'DB' });
  const ponderacionesCarreras = rows.map(row => ({
    ponderaciones: {
      nem: Number(row.nem),
      ranking: Number(row.ranking),
      matematica: Number(row.matematica),
      lenguaje: Number(row.lenguaje),
      ciencias_historia: Number(row.ciencias_historia)
    },
    hoja: book.addWorksheet(`${row.nombre}(${row.pk})`),
  }
  ));
  ponderacionesCarreras.forEach(({ hoja }) => {
    hoja.addRow(['RUT', 'Ponderación']).commit()
  });
  return ponderacionesCarreras;
}

module.exports = {
  ponderacionesCarreras,
}