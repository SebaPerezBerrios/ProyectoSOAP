const soap = require('soap');
const fs = require('fs');
const url = 'http://localhost:8001/esquemaServicio?wsdl';

const ponderacionPSU = (callback) => {
  soap.createClient(url, (err, client) => {
    if (err) throw err;
    const archivo = fs.readFileSync('puntajes.csv');
    const req = { nombreArchivo: 'text.xlxs', tipoMIME: 'xml', csv_B64: archivo.toString('base64') };
    client.ponderacionPSU(req, (err, res) => {
      if (err) throw err;
      callback(res);
    });
  });
};

ponderacionPSU((res) => {
  const excel = res.archivo;
  const buffer = Buffer.from(excel, 'base64');
  fs.writeFile('test.xlsx', buffer, (err) => {
    console.log('archivo creado');
  });
})
