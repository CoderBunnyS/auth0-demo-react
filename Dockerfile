FROM node:18-alpine as build

RUN apk update && \
  apk upgrade && \
  apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install -g --force npm@latest typescript@latest yarn@latest

RUN yarn install

COPY . .

RUN yarn build

# ---------------

FROM node:18-alpine

RUN mkdir -p /app/build

RUN apk update && \
  apk upgrade && \
  apk add git

WORKDIR /app

COPY --from=build /app/package.json .

RUN yarn install --production

COPY --from=build /app/build ./build
COPY --from=build /app/server.js .

EXPOSE 80

ENV PORT=80

CMD ["yarn", "serve"]
