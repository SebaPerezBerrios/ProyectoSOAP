const { Pool } = require('pg');

const pool = new Pool();

let getDatosCarreras = async () => {
  const { rows } = await pool.query("SELECT * FROM carreras_2020", []).catch(err => { throw 'DB' });
  return rows.map(row => ({
    ponderaciones: {
      nem: Number(row.nem),
      ranking: Number(row.ranking),
      matematica: Number(row.matematica),
      lenguaje: Number(row.lenguaje),
      ciencias_historia: Number(row.ciencias_historia),
      mininoLenguajeMatematica: parseInt(row.puntaje_minimo),
    },
    nombreHoja: `${row.nombre}(${row.pk})`,
    estado: {
      postulantes: [],
      seleccionados: [],
      vacantes: row.vacantes,
    },
  }
  ));
}

module.exports = {
  getDatosCarreras,
}