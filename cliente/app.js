const soap = require('soap');
const fs = require('fs');
const url = 'http://localhost:8001/esquemaServicio?wsdl';

const wsSecurity = new soap.WSSecurity('app', process.env.TOKEN_SECRET);

const ponderacionPSU = (callback) => {
  soap.createClient(url, (err, client) => {
    if (err) throw err;
    const archivo = fs.readFileSync('puntajes.csv');
    const req = { nombreArchivo: 'text.xlxs', mime: 'text/csv', csv_B64: archivo.toString('base64') };
    client.setSecurity(wsSecurity);
    client.ponderacionPSU(req, (err, res) => {
      if (err) {
        console.log('ERROR');
        console.log(err.body);
        console.log('----');
        throw 'ERROR';
      }
      callback(res);
    });
  })
};

ponderacionPSU((res) => {
  const excel = res.archivo;
  const buffer = Buffer.from(excel, 'base64');
  fs.writeFile('test.xlsx', buffer, (err) => {
    if (err) console.log(err);
    else console.log('archivo creado');
  });
})
