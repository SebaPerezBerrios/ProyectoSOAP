# Proyecto SOAP

# Descripción
Este repositorio contiene el backend SOAP,  además se incluye un cliente que permite testear el funcionamiento de la aplicación, ambos programas están hechos en `Node JS`.

# Requisitos de funcionamiento

- Se requiere`Node JS` LTS (v12.17.0).
- PostgreSQL actualizado en su version 12.

## Base de datos
En el repositorio se incluyen tanto el script de creación como el script de llenado de base de datos con la información de ponderaciones, puntajes y vacantes de las carreras impartidas por la UTEM periodo 2020.

## Instalación servidor
Desde la carpeta principal del proyecto.

```
cd servidor &&
npm install  &&
node-gyp configure build
```
## Ejecución servidor

```
cd servidor  &&
TOKEN_SECRET=<password>\
  PGUSER=<nombre usuario> \
  PGHOST=<ip servidor> \
  PGPASSWORD=<contaseña servidor> \
  PGDATABASE=<nombre base de datos> \
  PGPORT=<puerto servidor> \
  node app.js
```

El servidor confirmará el estado de ejecución.

## Instalación y ejecución cliente de prueba
Desde la carpeta principal del proyecto.

```
cd cliente &&
npm install &&
TOKEN_SECRET=<password>\
  node app.js
```
en la carpeta del cliente debe estar el archivo `puntajes.csv`.


## Conexión
Los clientes deben obtener el archivo WSDL de la dirección `http://localhost:8001/esquemaServicio?wsdl`.

## Autenticación
Se utiliza autenticación WS-Security en su modalidad PasswordText.
El nombre de usuario es `app` y password es cualquiera que se provea en el entorno de ejecución del servidor (TOKEN_SECRET), obviamente esta debe coincidir con la password enviada por el cliente para una conexión exitosa.

## Integrantes
- Léster Vasquez
- Ivan Pérez
- Sebastian Pérez
