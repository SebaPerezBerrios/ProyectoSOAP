const accum = require("accum");

const { generarExcel } = require("./crearExcel");
const { seleccionarPostulantes } = require("./ponderaciones");
const { getDatosCarreras } = require("../utils/carreras");

/**
 * Servicio de calculo de ponderaciones en base a puntajes.
 *
 * @param nombreArchivo           Nombre archivo destino.
 * @param mime                    Tipo mime del archivo a ser leido (defecto text/csv).
 * @param csv_B64                 Archivo csv encodeado en base64.
 * @param log                     Logger
 *
 * @return archivo .xlsx encodeado en base64 el cual se envia como response a la interfaz SOAP.
 */
const servicioPuntajes = (nombreArchivo, mime, csv_B64, log) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mime !== "text/csv") throw "MIME";

      const csv = Buffer.from(csv_B64, "base64").toString("ascii");

      const datosCarreras = await getDatosCarreras();
      log.info("obtenidas: ", datosCarreras.length, " carreras desde base de datos");

      seleccionarPostulantes(csv, datosCarreras, log);
      log.info("Termino procesamiento OK");

      let bufferSalida = accum.buffer((bufferCompletado) => {
        log.info("termino request exitoso: ", new Date().toJSON());
        resolve({
          nombreArchivo: nombreArchivo,
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          archivo: bufferCompletado.toString("base64"),
        });
      });

      generarExcel(datosCarreras, bufferSalida);
    } catch (err) {
      if (err === "DB") reject(soapErr("rpc:DBError", "Error in DB backend", log));
      else if (err === "CSV") reject(soapErr("rpc:BadArguments", "CSV format error", log));
      else if (err === "MIME") reject(soapErr("rpc:BadArguments", "Bad MIME type", log));
      else reject(soapErr("rpc:InternalError", "Internal server error", log));
    }
  });
};

/**
 * Genrar formato de error SOAP.
 *
 * @param value                   Valor soap error.
 * @param text                    Texto descriptivo del error.
 * @param log                     Logger
 *
 * @return archivo .xlsx encodeado en base64 el cual se envia como response a la interfaz SOAP.
 */
const soapErr = (value, text, log) => {
  log.warn("se emite Error SOAP: ", text, ". emitido: ", new Date().toJSON());
  return {
    Fault: {
      Code: {
        Value: "soap:Sender",
        Subcode: { value: value },
      },
      Reason: { Text: text },
    },
  };
};

module.exports = {
  servicioPuntajes,
};
