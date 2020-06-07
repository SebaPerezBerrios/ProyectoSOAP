const soap = require('soap');
const xml = require('fs').readFileSync('esquemaServicio.wsdl', 'utf8');
const express = require('express');

const { generarExcel } = require('./modules/crearExcel');

let servicio = {
  servicio: {
    puerto: {
      ponderacionPSU: async ({ nombreArchivo, tipoMIME, csv_B64 }) => {
        const csv = Buffer.from(csv_B64, 'base64').toString('ascii');
        const excel = generarExcel(csv);
        // TODO fix problema de rendimiento y memoria de buffer
        const excelBuffer = await excel.xlsx.writeBuffer();
        return { nombre: nombreArchivo, archivo: excelBuffer.toString('base64'), mime: 'excel' };
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
