const accum = require('accum');

const { generarExcel } = require('./crearExcel');
const { agregarPonderaciones } = require('./ponderaciones')
const { getDatosCarreras } = require('../utils/carreras')

const servicioPuntajes = (nombreArchivo, mime, csv_B64, log) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mime !== 'text/csv')
        throw 'MIME';

      const csv = Buffer.from(csv_B64, 'base64').toString('ascii');
      const lineas = csv.split(/\r?\n/)
        .filter(linea => !(linea === ''));

      log.info('Inicio procesamiento: ', lineas.length, ' lineas');

      let bufferSalida = accum.buffer((bufferCompletado) => {
        log.info('termino request exitoso: ', new Date().toJSON());
        resolve({
          nombreArchivo: nombreArchivo,
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          archivo: bufferCompletado.toString('base64'),
        });
      });

      const datosCarreras = await getDatosCarreras();
      log.info('obtenidas: ', datosCarreras.length, ' carreras desde base de datos');

      agregarPonderaciones(lineas, datosCarreras);
      log.info('Termino procesamiento OK');

      generarExcel(datosCarreras, bufferSalida);
    }
    catch (err) {
      if (err === 'DB')
        reject(soapErr('rpc:DBError', 'Error in DB backend'), log);
      else if (err === 'CSV')
        reject(soapErr('rpc:BadArguments', 'CSV format error'), log);
      else if (err === 'MIME')
        reject(soapErr('rpc:BadArguments', 'Bad MIME type'), log);
      else
        reject(soapErr('rpc:InternalError', 'Internal server error'), log);
    }
  });
}

const soapErr = (value, text, log) => {
  log.warn('se emite Error SOAP: ', text, '. emitido: ', new Date().toJSON());
  return {
    Fault: {
      Code: {
        Value: 'soap:Sender',
        Subcode: { value: value }
      },
      Reason: { Text: text }
    }
  };
}

module.exports = {
  servicioPuntajes
}