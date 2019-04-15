const express = require('express');
const server = express.Router();
const consultorBase = require('./baseDatos');

server.route('/login').post (function (req, res) {
       consultorBase.consultarUsuario(req.body, (respuesta) =>  {
        console.log(respuesta)
            res.status(200).send(respuesta)                    
       });   
});

server.route('/registropasajero').post (function (req, res) {
    consultorBase.registrarPasajero(req.body, (respuesta) =>  {
        console.log(respuesta)
        res.status(200).send(respuesta)                    
    });   
});

server.route('/registroconductor').post (function (req, res) {
    consultorBase.registrarConductor(req.body, (respuesta) =>  {
        console.log(respuesta)
        res.status(200).send(respuesta)                    
    });   
});


server.route('/conductor').post (function (req, res) {
    consultorBase.consultarConductor((respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/solicitarservicio').post (function (req, res) {
    consultorBase.solictarServicio(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/finalizarservicio').post (function (req, res) {
    consultorBase.finalizarServicio(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/consultarservicio').post (function (req, res) {
    consultorBase.consultarServicio(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/usotaxi').post (function (req, res) {
    consultorBase.actualizarUso(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/conectado').post (function (req, res) {
    consultorBase.actualizarConectado(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/actposicion').post (function (req, res) {
    consultorBase.actPosicion(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/obtenerdatos').post (function (req, res) {
    consultorBase.obtenerDatos(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

server.route('/cobrar').post (function (req, res) {
    consultorBase.cobrar(req.body, (respuesta) =>  {
     console.log(respuesta)
     res.send(respuesta)
    });   
});

module.exports = server;