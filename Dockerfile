# front
FROM node:20 AS client-builder
WORKDIR /app
COPY ./client/package*.json ./client/
RUN cd client && npm install
COPY ./client ./client
RUN cd client && npm run build

# back
FROM node:20
WORKDIR /app

# Installer les deps du serveur
COPY ./server/package*.json ./server/
RUN cd server && npm install

# Copier les sources du serveur
COPY ./server ./server

# Copier le build du front dans le dossier public du back
COPY --from=client-builder /app/client/build/client ./server/public

# Entrée dans le bon dossier
WORKDIR /app/server

# Exposer le port du back
EXPOSE 3000

# Lancer le serveur
CMD ["npm", "start"]
