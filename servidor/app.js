const soap = require('soap');
const xml = require('fs').readFileSync('esquemaServicio.wsdl', 'utf8');
const express = require('express');
const accum = require('accum');

const { generarExcel } = require('./modules/crearExcel');

let servicio = {
  servicio: {
    puerto: {
      ponderacionPSU: ({ nombreArchivo, tipoMIME, csv_B64 }, callback) => {
        const csv = Buffer.from(csv_B64, 'base64').toString('ascii');
        const lineas = csv.split(/\r?\n/)
          .filter(linea => !(linea === ''));

        let bufferSalida = accum.buffer((bufferCompleto) => {
          callback(
            { nombre: nombreArchivo, archivo: bufferCompleto.toString('base64'), mime: 'excel' }
          );
        })
        generarExcel(lineas, bufferSalida);
      }
    }
  }
};

const puerto = 8001;

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, soapaction, Accept");
  next();
});


app.listen(puerto, function () {
  soap.listen(app, '/esquemaServicio', servicio, xml, function () {
    console.log('servidor iniciado en puerto:', puerto);
  });
});
