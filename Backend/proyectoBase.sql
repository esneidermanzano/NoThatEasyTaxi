DROP EXTENSION IF EXISTS postgis CASCADE;
DROP EXTENSION IF EXISTS postgis_topology CASCADE;
DROP EXTENSION IF EXISTS pgcrypto; 



CREATE EXTENSION pgcrypto;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

DROP TABLE IF EXISTS taxi CASCADE;
CREATE TABLE taxi(
	placa VARCHAR(6) NOT NULL,
	marca VARCHAR(50) NOT NULL,
	referencia VARCHAR(25) NOT NULL,
	modelo VARCHAR(4) NOT NULL,
	soat VARCHAR(20) NOT NULL,
	baul BIT NOT NULL,
	usado BIT NOT NULL,
	CONSTRAINT taxi_pk PRIMARY KEY(placa)
);

DROP TABLE IF EXISTS conductor CASCADE;
CREATE TABLE conductor(
	cedula VARCHAR(20) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	contrasena TEXT NOT NULL,
	placa VARCHAR(6) NOT NULL,
	disponiblidad BIT NOT NULL,
	posicion geometry(POINT,4326) NOT NULL,
	estado BIT NOT NULL,
	CONSTRAINT conductor_pk PRIMARY KEY(cedula),
	CONSTRAINT placa_fk FOREIGN KEY(placa) REFERENCES taxi(placa)
);

DROP TABLE IF EXISTS pasajero CASCADE; 
CREATE TABLE pasajero(
	no_celular VARCHAR(10) NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	contrasena TEXT NOT NULL,
	no_tarjeta VARCHAR(20) NOT NULL,
	direccion geometry(POINT,4326),
	estado BIT NOT NULL,
	conectado BIT NOT NULL,
	CONSTRAINT pasajero_pk PRIMARY KEY (no_celular)
);
DROP TABLE IF EXISTS favoritos;
CREATE TABLE favoritos(
	no_celular VARCHAR(10) NOT NULL,
	favorito geometry(POINT,4326) NOT NULL,
	CONSTRAINT favoritos_pk PRIMARY KEY (no_celular,favorito),
	CONSTRAINT favoritos_fk FOREIGN KEY(no_celular) REFERENCES pasajero(no_celular)
);
DROP TABLE IF EXISTS servicio;
CREATE TABLE servicio(
	no_servicio SERIAL NOT NULL,
	cedula VARCHAR(20) NOT NULL,
	no_celular VARCHAR(10) NOT NULL,
	calificacion INT,
	costo FLOAT NOT NULL,
	distancia FLOAT NOT NULL,
	pagado BIT NOT NULL,
	origen geometry(POINT,4326) NOT NULL,
	destino geometry(POINT,4326) NOT NULL,
	fecha_hora TIMESTAMP NOT NULL,
	realizado BIT NOT NULL,
	CONSTRAINT servicio_pk PRIMARY KEY (no_servicio,cedula,no_celular),
	CONSTRAINT servicio_fk FOREIGN KEY(cedula) REFERENCES conductor(cedula),
	CONSTRAINT servicio_fk1 FOREIGN KEY(no_celular) REFERENCES pasajero(no_celular)
);

CREATE OR REPLACE FUNCTION calcularCosto() RETURNS TRIGGER AS $$
DECLARE 
	distancia FLOAT:=0;
	unidades FLOAT:=22;
	costo FLOAT:=4700;
BEGIN 
	distancia:= ST_Distance(NEW.origen,NEW.destino)*111000;
	NEW.distancia:=to_char(distancia,'FM999999999');
	NEW.fecha_hora:=current_timestamp;
	unidades:= unidades + distancia/80;
	IF (unidades<72)
	THEN
		NEW.costo:=to_char(costo,'FM999999999');
	ELSE
		NEW.costo:= to_char(unidades*100,'FM999999999');
	END IF;
	UPDATE conductor SET posicion = NEW.destino, disponiblidad = B'0' WHERE cedula = NEW.cedula; 
	RETURN NEW;
END 
$$ LANGUAGE plpgsql;
																	   
CREATE TRIGGER inserta_servicio BEFORE INSERT ON servicio FOR EACH ROW EXECUTE PROCEDURE calcularCosto();

INSERT INTO pasajero VALUES('3163611275','Cucho',crypt('estemen',gen_salt('bf')),'123456789',ST_GeomFromText('POINT(3.373190 -76.535214)',4326),B'1',B'0');
INSERT INTO taxi VALUES('abc234','mazda','2','2018','12345',B'1',B'0');
INSERT INTO conductor VALUES('1122445577','YISUS',crypt('nel',gen_salt('bf')),'abc234',B'1',ST_GeomFromText('POINT(3.373190 -76.535214)',4326),B'1');

ALTER TABLE servicio ALTER COLUMN costo DROP NOT NULL;
ALTER TABLE servicio Alter column distancia DROP NOT NULL;
/*
INSERT INTO servicio(cedula,no_celular,calificacion,pagado,origen,destino,realizado) VALUES(
	'1122445577',
	'3163611275',
	NULL,
	B'0',
	ST_GeomFromText('POINT(3.431996 -76.478859)',4326),
	ST_GeomFromText('POINT(3.434302 -76.535375)',4326),
	B'0'
	);
*/												
																	


DROP INDEX IF EXISTS indice_pasajero;
DROP INDEX IF EXISTS indice_conductor;
														
CREATE INDEX indice_pasajero ON pasajero USING hash(no_celular);
CREATE INDEX indice_conductor ON conductor USING hash(cedula);

DROP USER IF EXISTS usuario;
CREATE USER usuario PASSWORD '1234';
GRANT INSERT,SELECT,UPDATE ON taxi,conductor,pasajero,favoritos,servicio TO usuario; 			

SELECT * FROM servicio;  

