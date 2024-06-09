# Etapa 1: Construcción de la aplicación
FROM node:16.20.2-alpine AS build-stage

# Establecemos un directorio de trabajo en la imagen
WORKDIR /app

# Copiamos los archivos 'package.json' y 'package-lock.json'
COPY package*.json ./

# Instalamos dependencias del proyecto
RUN npm install

# Copiamos todos los archivos al directorio de trabajo de la imagen
COPY . .

# Construimos la aplicación
RUN npm run build

# Instalamos http-server globalmente
RUN npm install -g http-server

# Exponemos el puerto 8080
EXPOSE 8080

# Comando para iniciar http-server
CMD ["http-server", "build"]
