const pg = require('pg');

const connectionData ={
    user: 'postgres',
    host: 'base',
    database: 'proyectoBases',
    password: 'stemen',
    port: 5432,
}
const conexion = new pg.Pool(connectionData);

function consultarUsuario(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            nombre: "",
            id: "",
            identificador: false,
            contrasena: false,
            errorBase: false,
            ocupado: false,            
            placa: ""
        }, consulta = "";

        if (valor.conductor){
            consulta = "SELECT * FROM conductor WHERE cedula =$1";
            console.log("consultado un conductor")
        }else{
            consulta = "SELECT * FROM pasajero WHERE no_celular =$1"
            console.log("consultado un pasajero")
        }
        conexion.query(consulta, [valor.identificador])
        .then(response => {
            if(response.rows.length){
                respuesta.identificador = true;
                if (valor.conductor){
                    consulta = "SELECT nombre, cedula, placa FROM conductor WHERE cedula =$1 AND contrasena=CRYPT($2, contrasena)";
                }else{
                    consulta = "SELECT nombre, no_celular, conectado FROM pasajero WHERE no_celular =$1 AND contrasena=CRYPT($2, contrasena)"
                }
                conexion.query(consulta, [valor.identificador, valor.contrasena])
                .then(response1 => {
                    
                    if(response1.rows.length){
                        respuesta.contrasena = true; 
                        respuesta.nombre = response1.rows[0].nombre;
                        if(valor.conductor){
                            respuesta.id = response1.rows[0].cedula;
                            respuesta.placa = response1.rows[0].placa;
                            let consultaTaxi = "SELECT * FROM taxi WHERE placa=$1 AND usado= B'1';"

                            conexion.query(consultaTaxi, [respuesta.placa])
                            .then(response2 =>{
                                if(response2.rows.length){
                                    respuesta.ocupado = true;
                                    conexion.release()
                                    callback(respuesta); 
                                }else{
                                    conexion.query("UPDATE taxi SET usado= B'1' WHERE placa=$1", [respuesta.placa])
                                    conexion.release()
                                    callback(respuesta); 
                                }
                            }).catch(err => {
                                console.log("Error al consultar disponibilidad del taxi " + err)
                                conexion.release()                    
                                respuesta.errorBase = true;
                                callback(respuesta);
                            })

                        }else{
                            console.log(response1.rows[0].conectado)
                            if(response1.rows[0].conectado == 1){
                                respuesta.ocupado = true;
                                respuesta.id = response1.rows[0].no_celular;
                                conexion.release()
                                callback(respuesta);
                            }else{
                                respuesta.id = response1.rows[0].no_celular;
                                conexion.query("UPDATE pasajero SET conectado= B'1' WHERE no_celular=$1", [respuesta.id])
                                .then(response3 =>{
                                    conexion.release()
                                    callback(respuesta);
                                }).catch(err =>{
                                    console.log("Error al actualizar estado " + err)
                                    conexion.release()                    
                                    respuesta.errorBase = true;
                                    callback(respuesta);
                                })                                                           
                            }
                             
                        }
                        console.log("Encontro el password")                   
                    }else{
                        conexion.release()                    
                        callback(respuesta);
                    }
                           
                }).catch(err => {
                    console.log("Error al consultar password " + err)
                    conexion.release()                    
                    respuesta.errorBase = true;
                    callback(respuesta);
                });    
            }else{
                console.log('No encontro nada')
                callback(respuesta);
                conexion.release()
            }        
        }).catch(err => {
            console.log("Error al consultar identificador " + err)
            conexion.release()
            respuesta.errorBase = true;
            callback(respuesta);
        });
    });
   
}

function registrarPasajero(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            existente: false,
            errorBase: false
        };
        conexion.query("SELECT * FROM pasajero WHERE no_celular =$1", [valor.celular])
        .then(response => {
            if(response.rows.length){
                respuesta.existente = true;
                callback(respuesta);
                conexion.release();                
            }else{
                conexion.query("INSERT INTO pasajero (no_celular, nombre, contrasena, no_tarjeta, estado, conectado)" +
                " VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, B'1', B'1')", [valor.celular, valor.nombre, valor.contrasena, valor.tarjeta])
                .then(response1 => {
                    console.log('Registor exitoso')  
                    conexion.release()
                    callback(respuesta);                                      
                }).catch(err => {
                    respuesta.errorBase = true;
                    console.log("Error al registrar pasajero " + err)
                    conexion.release()
                    callback(respuesta); 
                });                                   
            }        
        }).catch(err => {
            console.log("Error al consultar celular " + err)
            conexion.release()
            respuesta.errorBase = true;
            callback(respuesta);
        });
    });
   
}

function registrarConductor(valor, callback)  {
    console.log(valor)
    conexion.connect().then(conexion => {
        let respuesta = {
            conductorExiste: false,
            taxiExiste: false,
            exitoso: false,
            errorBase: false
        };
        conexion.query("SELECT * FROM conductor WHERE cedula =$1", [valor.cedula])
        .then(response => {
            if(response.rows.length){
                respuesta.conductorExiste = true;
                callback(respuesta);
                conexion.release();                
            }else{
                conexion.query("SELECT placa FROM taxi WHERE placa=$1", [valor.placa])
                .then(response1 => {
                    if(response1.rows.length && valor.existente){

                        let orden = "INSERT INTO conductor VALUES($1,$2,crypt($3,gen_salt('bf')),$4, B'1', ST_GeomFromText('POINT(3.451792 -76.532494)',4326), B'1');",
                            variables = [valor.cedula, valor.nombre, valor.contrasena, valor.placa];
                        conexion.query(orden, variables).then(response2 => {
                            respuesta.exitoso = true;
                            callback(respuesta);
                            conexion.release();                
                        }).catch(err =>{
                            respuesta.errorBase = true;
                            console.log("Error al registrar conductor " + err)
                            conexion.release()
                            callback(respuesta); 
                        })
                        
                    }else if(!response1.rows.length && valor.existente){
                        //Taxi no registrado mentiroso
                        callback(respuesta);
                        conexion.release(); 
                    }else if(response1.rows.length && !valor.existente){
                        //Taxi ya registrado home
                        respuesta.taxiExiste = true;
                        callback(respuesta);
                        conexion.release(); 
                    }else {
                        //procedemos a registrarlo
                        conexion.query('BEGIN', (error) =>{
                            if(error){
                                respuesta.errorBase = true;
                                callback(respuesta);
                                conexion.release(); 
                            }
                            let orden = "", variables = [valor.placa, valor.marca, valor.referencia, valor.modelo, valor.soat];
                            if(valor.baul){
                                orden = "INSERT INTO taxi VALUES ($1, $2, $3, $4, $5, B'1')";
                            }else{
                                orden = "INSERT INTO taxi VALUES ($1, $2, $3, $4, $5, B'0')"
                            }
                            conexion.query(orden, variables, (error) =>{
                                if(error){
                                    respuesta.errorBase = true;
                                    callback(respuesta);
                                    conexion.release(); 
                                }

                                let orden2 = "INSERT INTO conductor VALUES($1,$2,crypt($3,gen_salt('bf')),$4, B'1', ST_GeomFromText('POINT(3.451792 -76.532494)',4326), B'1');",
                                variables2 = [valor.cedula, valor.nombre, valor.contrasena, valor.placa];
                                conexion.query(orden2, variables2, (error) =>{
                                    if(error){
                                        respuesta.errorBase = true;
                                        callback(respuesta);
                                        conexion.release(); 
                                    }    
                                    conexion.query('COMMIT', (error) => {
                                        if(error){
                                            respuesta.errorBase = true;
                                            callback(respuesta);
                                            conexion.release(); 
                                        } 
                                        respuesta.exitoso = true
                                        conexion.release();
                                        callback(respuesta);
                                        console.log("Registro exitoso!")
                                    })            
                                });                                
                            });                                                
                        });  
                    }                                                    
                }).catch(err => {
                    respuesta.errorBase = true;
                    console.log("Error al consultar placa " + err)
                    conexion.release()
                    callback(respuesta); 
                });                                   
            }        
        }).catch(err => {
            console.log("Error al consultar cedula " + err)
            conexion.release()
            respuesta.errorBase = true;
            callback(respuesta);
        });
    });
   
}

function solictarServicio(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            placa: "",
            marca: "",
            referencia: "",   
            nombreConductor: "", 
            cedulaConductor: "",           
            distancia: "",  
            numeroServicio: "",
            costo: "",       
            errorBase: false
        }, consulta = "";

        consulta = "WITH taxi_distancia AS "+
            "(SELECT nombre,cedula,placa,ST_Distance(posicion,ST_GeomFromText('POINT("+valor.origen+")',4326))*111000 AS distancia FROM conductor WHERE disponiblidad=B'1' AND estado=B'1'),"+ 
            "taxi_conductor AS"+
            "(SELECT nombre,cedula,placa,marca,referencia,distancia FROM taxi_distancia NATURAL JOIN  taxi WHERE baul=B'"+valor.baul+"' ORDER BY distancia ASC LIMIT 1)"+
            " SELECT * FROM taxi_conductor;"

        conexion.query(consulta).then(response =>{
            if(!response.rows.length){
                conexion.release()                    
                callback(respuesta);
            }else{
                respuesta.nombreConductor = response.rows[0].nombre;
                respuesta.cedulaConductor = response.rows[0].cedula;
                respuesta.referencia = response.rows[0].referencia;
                respuesta.marca = response.rows[0].marca;
                respuesta.placa = response.rows[0].placa;
                respuesta.distancia = response.rows[0].distancia;

                let conuslta2 = "INSERT INTO servicio(cedula,no_celular,calificacion,pagado,origen,destino,realizado) VALUES($1, $2, NULL, B'0', ST_GeomFromText('POINT("+valor.origen+")',4326), ST_GeomFromText('POINT("+valor.destino+")',4326), B'0') RETURNING no_servicio,costo;";
                conexion.query(conuslta2, [response.rows[0].cedula, valor.celular])
                .then(response2 =>{
                    conexion.release()  
                    respuesta.costo = response2.rows[0].costo;
                    respuesta.numeroServicio = response2.rows[0].no_servicio;                  
                    callback(respuesta);
                    console.log("Servicio prestado con exito")
                }).catch(err =>{
                    console.log("Error al resgistrar servicio " +err)
                    conexion.release()                    
                    respuesta.errorBase = true;
                    callback(respuesta);
                })
            }
        }).catch(err =>{
            console.log("Error al buscar taxista mas cercano " + err)                               
            respuesta.errorBase = true;
            callback(respuesta);
            conexion.release() 
        })

        });
}

function finalizarServicio(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            exitoso: false, 
            errorBase: false
        }, consulta = "";

        consulta = "BEGIN;"+
        "UPDATE conductor SET disponiblidad = B'1' WHERE cedula = '"+valor.cedula+"';"+
        "UPDATE servicio SET calificacion = "+valor.calificacion+", realizado = B'1' WHERE no_servicio = "+valor.noServicio+";"+
        "COMMIT;"

        conexion.query(consulta)
        .then(response =>{
            respuesta.exitoso = true;
            conexion.release()                    
            callback(respuesta);            
        }).catch(err =>{
            console.log("Error al finalizar servicio " + err)                               
            respuesta.errorBase = true;
            callback(respuesta);
            conexion.release() 
        })

        });
}

function consultarServicio(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            nombrePasajero: "",
            distancia: "", 
            costo: "",
            hayServicio: false,
            errorBase: false,
            destinoX: "",
            destinoY: ""
        }, consulta = "";

        consulta = "SELECT nombre, distancia, costo, ST_X(destino) AS lat, ST_Y(destino) AS lon FROM servicio NATURAL JOIN pasajero WHERE cedula = $1 AND realizado = B'0'";

        conexion.query(consulta, [valor.cedula])
        .then(response =>{
            if(response.rows.length){
                respuesta.nombrePasajero = response.rows[0].nombre;
                respuesta.distancia =  response.rows[0].distancia;
                respuesta.costo =  response.rows[0].costo;
                respuesta.hayServicio = true;
                respuesta.destinoX = response.rows[0].lat;
                respuesta.destinoY = response.rows[0].lon;
            }                   
            conexion.release()                    
            callback(respuesta);            
        }).catch(err =>{
            console.log("Error al consultar servicio " + err)                               
            respuesta.errorBase = true;
            callback(respuesta);
            conexion.release() 
        })

        });
}

function actualizarUso(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            errorBase: false
        };

        conexion.query("UPDATE taxi SET usado= B'0' WHERE placa=$1", [valor.placa])
        .then(response =>{
            conexion.release()
            callback(respuesta); 
        }).catch(err=>{
            respuesta.errorBase = true;
            conexion.release()
            callback(respuesta); 
        })

    });
}

function actualizarConectado(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            errorBase: false
        };

        conexion.query("UPDATE pasajero SET conectado= B'0' WHERE no_celular=$1", [valor.celular])
        .then(response =>{
            conexion.release()
            callback(respuesta); 
        }).catch(err=>{
            console.log("Error al actualizar estado "+ err)
            respuesta.errorBase = true;
            conexion.release()
            callback(respuesta); 
        })

    });
}

function obtenerDatos(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            kilometros: "",
            saldo: "",
            errorBase: false
        }, consulta = "";
        console.log(valor)

        if(valor.conductor){
            consulta = "SELECT SUM(costo) AS total FROM servicio WHERE cedula = $1 AND pagado = B'0'";
        }else{
            consulta = "SELECT SUM(distancia) AS total FROM servicio WHERE no_celular = $1";
        }
        conexion.query(consulta, [valor.identificador])
            .then(response1 => {
                if(response1.rows[0].total !== null){
                    respuesta.kilometros = response1.rows[0].total;
                }else{
                    respuesta.kilometros = "0";
                }                
                if(valor.conductor){
                    conexion.query("SELECT SUM(costo) FROM servicio WHERE cedula = $1 AND pagado = B'0'", [valor.identificador])
                    .then(response =>{
                        if(response.rows[0].total !== null){
                            respuesta.saldo = response.rows[0].total; 
                        }else{
                            respuesta.saldo = "0"; 
                        }                                                                
                    }).catch(err=>{
                        console.log("Error al obtener el total "+ err)
                        respuesta.errorBase = true;
                        conexion.release()
                        callback(respuesta); 
                    })
                }else{
                    conexion.release()
                    callback(respuesta);
                }            
            }).catch(err =>{
                console.log("Error al obtener kilometros "+ err)
                respuesta.errorBase = true;
                conexion.release()
                callback(respuesta); 
            })   
    });
}

function cobrar(valor, callback)  {
    conexion.connect().then(conexion => {
        let respuesta = {
            errorBase: false
        };

        conexion.query("UPDATE servicio SET pagado = B'1' WHERE cedula = $1", [valor.identificador])
        .then(response =>{
            conexion.release()
            callback(respuesta); 
        }).catch(err=>{
            console.log("Error al actualizar estado "+ err)
            respuesta.errorBase = true;
            conexion.release()
            callback(respuesta); 
        })

    });
}

module.exports.cobrar = cobrar;
module.exports.obtenerDatos = obtenerDatos;
module.exports.actualizarConectado = actualizarConectado;
module.exports.actualizarUso = actualizarUso;
module.exports.consultarServicio = consultarServicio;
module.exports.finalizarServicio = finalizarServicio;
module.exports.solictarServicio = solictarServicio;
module.exports.registrarConductor = registrarConductor;
module.exports.consultarUsuario = consultarUsuario;
module.exports.registrarPasajero = registrarPasajero;
