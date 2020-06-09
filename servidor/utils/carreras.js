const { Pool } = require('pg');

const pool = new Pool();

let ponderacionesCarreras = async () => {
  const { rows } = await pool.query("SELECT * FROM carreras_2020", []).catch(err => { throw 'DB' });
  return rows.map(row => ({
    codigo: parseInt(row.pk),
    ponderaciones: {
      nem: Number(row.nem),
      ranking: Number(row.ranking),
      matematica: Number(row.matematica),
      lenguaje: Number(row.lenguaje),
      ciencias_historia: Number(row.ciencias_historia)
    }
  }
  ));
}

const crearHojasCarreras = async (book) => {
  const { rows } = await pool.query("SELECT pk, nombre FROM carreras_2020", []).catch(err => { throw 'DB' });
  let hojasCarreras = {}
  rows.forEach(row => {
    hojasCarreras[row.pk] = book.addWorksheet(row.nombre);
  });
  return hojasCarreras;
}

module.exports = {
  ponderacionesCarreras,
  crearHojasCarreras
}