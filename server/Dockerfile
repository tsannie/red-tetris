# Base image
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./

# Dev image
FROM base AS development
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Prod image
FROM base AS production
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
