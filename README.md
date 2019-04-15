# NoThatEasyTaxi

This is a DataBase's proyect subject

## Prerequisites

For use this project you must to have or install next programs:
- Docker CE
- Docker compose

View installation documentation of [Docker CE](https://docs.docker.com/v17.12/install/) and [Docker compose](https://docs.docker.com/compose/install/)
## Installation

First, you have to clone this repository or download it, then go into the container folder, and execute docker-compose.yml file as follow: 

```bash
docker-compose build
```
This step begins to prepare Docker's containers with the proyect, when finished, type next command:
```bash
docker-compose up
```
Wait until finished, you should see next lines:

```bash
database system is ready to accept connections // --Database-Server ready
Servidor corriendo  //-- Backend ready
You can now view interface in the browser. //-- Front ready

```

So, ¡you can use it!

## How to begin

As default, program has 3 register for quickly start:

User kind "Pasajero"
- Identifier: 3163611275
- Password: estemen

User kind "Conductor"
- Identifier: 1122445577
- Password: nel

This last with linked taxi "abc234".
