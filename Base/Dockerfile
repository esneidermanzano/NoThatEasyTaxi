FROM mdillon/postgis:latest
RUN apt-get update \
ENV POSTGRES_DB proyectoBases
COPY proyectobase.sql /docker-entrypoint-initdb.d/ 
EXPOSE 5432
