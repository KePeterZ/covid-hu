FROM node:alpine

WORKDIR /covidgohu
COPY . .

RUN yarn
RUN yarn tsc

ENTRYPOINT [ "node", "dist/main.js" ]