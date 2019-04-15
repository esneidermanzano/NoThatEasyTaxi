FROM node:latest
RUN mkdir /Frontend
WORKDIR /Frontend
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
