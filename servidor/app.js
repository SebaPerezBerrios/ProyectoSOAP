const soap = require("soap");
const xml = require("fs").readFileSync("esquemaServicio.wsdl", "utf8");
const express = require("express");
const log = require("simple-node-logger").createSimpleLogger("proyectoSOAP.log");

const { servicioPuntajes } = require("./modules/servicio");

let servicio = {
  servicio: {
    puerto: {
      ponderacionPSU: ({ nombreArchivo, mime, csv_B64 }) => {
        log.info("inicio request: ", new Date().toJSON());
        return servicioPuntajes(nombreArchivo, mime, csv_B64, log);
      },
    },
  },
};

const puerto = 8001;

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "soapaction");
  next();
});

app.listen(puerto, function () {
  soap.listen(app, "/esquemaServicio", servicio, xml, function () {
    console.log("servidor iniciado en puerto:", puerto);
  }).authenticate = function (security) {
    if (!security) return false;
    const token = security.UsernameToken;
    const user = token.Username;
    const password = token.Password;
    return user === "app" && password["$value"] === process.env.TOKEN_SECRET;
  };
});
