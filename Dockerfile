FROM node:20-alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY ./tsconfig.json ./

COPY ./nodemon.json ./

COPY ./loader.mjs ./

RUN npm install

COPY ./src ./src

COPY ./.env.example ./

CMD ["npm", "run", "dev"]