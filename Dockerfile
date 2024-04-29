FROM node:lts-alpine3.19

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY package*.json ./

RUN yarn

COPY . .

ENV NODE_ENV=production

RUN yarn build

RUN yarn cache clean

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["yarn", "start:prod"]
