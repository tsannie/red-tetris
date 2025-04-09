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
COPY ./server/package*.json ./server/
RUN cd server && npm install
COPY ./server ./server
COPY --from=client-builder /app/client/build/client ./server/public
WORKDIR /app/server
EXPOSE 3000
CMD ["npm", "start"]
