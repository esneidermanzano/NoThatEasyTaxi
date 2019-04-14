FROM mdillon/postgis:latest
RUN apt-get update
ENV POSTGRES_DB proyectoBases
COPY proyectoBase.sql /docker-entrypoint-initdb.d/ 
EXPOSE 5432
