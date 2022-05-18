FROM node:lts AS prod 

RUN mkdir -p /app/server
WORKDIR /app

RUN apt update\
  && apt install yarn -y

COPY . /app

RUN yarn global add @nestjs/cli -y\
  && yarn install -y

# Set Timezone to CST
ENV TZ=Asia/Taipei

RUN ln -snf /usr/share/zoneinfo/TZ\
  /etc/localtime\
  && echo $TZ > /etc/Timezone

RUN yarn build

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "cd /app && yarn start"]
