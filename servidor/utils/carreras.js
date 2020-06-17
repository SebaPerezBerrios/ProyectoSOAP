const { Pool } = require('pg');

const pool = new Pool();

/**
 * Obtener datos de carreras desde base de datos.
 * Se agrega campo estado para almacenar postulantes, seleccionados y vacantes restantes por carrera.
 *              
 * @return                        Array de los datos y estado de las carreras de la universidad.
 */
let getDatosCarreras = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM carreras_2020", []);
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
  catch (err) {
    throw 'DB'
  }
}

module.exports = {
  getDatosCarreras,
}