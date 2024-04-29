FROM node:18-alpine As build

WORKDIR /app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn

COPY --chown=node:node . .

ENV NODE_ENV=production

RUN npm run build

RUN yarn cache clean

FROM node:18-alpine As production

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/src/ ./src
COPY --chown=node:node --from=build /app/package.json ./

RUN mkdir temp && chown node:node ./temp

EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["yarn", "start:prod"]