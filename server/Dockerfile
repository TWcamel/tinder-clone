FROM node:latest AS dev

WORKDIR /app

RUN apt update\ 
  && apt install -y yarn

COPY package*.json ./

RUN yarn add tsc-watch -g\
  && yarn install

COPY . .

RUN yarn build

FROM node:latest AS prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=dev /app .

EXPOSE 8080

CMD ["yarn", "start"]



