FROM node:19-alpine

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml /app/

RUN pnpm install

COPY . /app

CMD ["pnpm", "dev"]
