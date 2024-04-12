FROM node:lts-alpine3.19

RUN apk add --no-cache \
  dumb-init

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENTRYPOINT ["dumb-init", "--"]

CMD ["yarn", "start:prod"]
