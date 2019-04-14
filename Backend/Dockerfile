FROM node:latest
RUN mkdir /Backend
WORKDIR /Backend
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 4000
CMD [ "npm", "start" ]
