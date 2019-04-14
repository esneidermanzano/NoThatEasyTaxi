const express = require('express');
const server = express();
const puerto = 4000;
const cors = require('cors')
const bodyParser = require('body-parser');
const rutas = require('./rutas');

server.use(cors());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use('/', rutas);

server.listen(puerto, ()=>{
    console.log("Servidor corriendo");
})