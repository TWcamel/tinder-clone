FROM node:lts AS prod 

RUN mkdir -p /app/client
RUN mkdir -p /app/server
WORKDIR /app/server 

RUN apt update\
  && apt install yarn -y

COPY . /app/server

RUN yarn global add @nestjs/cli -y\
  && yarn install -y

# Set Timezone to CST
ENV TZ=Asia/Taipei

RUN ln -snf /usr/share/zoneinfo/TZ\
  /etc/localtime\
  && echo $TZ > /etc/Timezone

RUN yarn build

ENTRYPOINT ["sh", "-c", "cd /app/server && yarn start"]
