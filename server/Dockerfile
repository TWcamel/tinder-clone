FROM node:latest AS development 

WORKDIR /app

RUN apt update\ 
  && apt install -y yarn

COPY package*.json ./

RUN yarn global add @nestjs/cli \
  && yarn install

COPY . .

RUN yarn build

FROM node:latest AS prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=development /app .

EXPOSE 8080

CMD ["yarn", "start"]



