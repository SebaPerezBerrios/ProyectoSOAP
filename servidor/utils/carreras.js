const { Pool } = require('pg');

const pool = new Pool();

let getDatosCarreras = async (book) => {
  const { rows } = await pool.query("SELECT * FROM carreras_2020", []).catch(err => { throw 'DB' });
  return rows.map(row => ({
    ponderaciones: {
      nem: Number(row.nem),
      ranking: Number(row.ranking),
      matematica: Number(row.matematica),
      lenguaje: Number(row.lenguaje),
      ciencias_historia: Number(row.ciencias_historia)
    },
    estado: {
      postulantes: [],
    },
    vacantes: row.vacantes,
    nombreHoja: `${row.nombre}(${row.pk})`,
  }
  ));
}

module.exports = {
  getDatosCarreras,
}