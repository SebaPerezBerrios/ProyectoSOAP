const soap = require('soap');
const xml = require('fs').readFileSync('esquemaServicio.wsdl', 'utf8');
const express = require('express');
const accum = require('accum');

const { generarExcel } = require('./modules/crearExcel');

const soapErr = (value, text) => {
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

let servicio = {
  servicio: {
    puerto: {
      ponderacionPSU: ({ nombreArchivo, mime, csv_B64 }) => {
        return new Promise((resolve, reject) => {
          try {
            if (mime !== 'text/csv')
              throw 'MIME';
            const csv = Buffer.from(csv_B64, 'base64').toString('ascii');
            const lineas = csv.split(/\r?\n/)
              .filter(linea => !(linea === ''));

            let bufferSalida = accum.buffer((bufferCompletado) => {
              resolve({
                nombreArchivo: nombreArchivo,
                mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                archivo: bufferCompletado.toString('base64'),
              });
            });
            generarExcel(lineas, bufferSalida).catch(err => {
              if (err === 'DB')
                reject(soapErr('rpc:DBError', 'Error in DB backend'));
              if (err === 'CSV')
                reject(soapErr('rpc:BadArguments', 'CSV format error'));
              reject(soapErr('rpc:InternalError', 'Internal server error'));
            });
          }
          catch (err) {
            if (err === 'MIME')
              reject(soapErr('rpc:BadArguments', 'Bad MIME type'));
            reject(soapErr('rpc:BadArguments', 'Bad Request'));
          }
        });
      }
    }
  }
};

const puerto = 8001;

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "soapaction");
  next();
});

app.listen(puerto, function () {
  soap.listen(app, '/esquemaServicio', servicio, xml, function () {
    console.log('servidor iniciado en puerto:', puerto);
  })
    .authenticate = function (security) {
      if (!security) return false;
      const token = security.UsernameToken;
      const user = token.Username;
      const password = token.Password;
      return user === 'app' && password['$value'] === process.env.TOKEN_SECRET;
    };
});