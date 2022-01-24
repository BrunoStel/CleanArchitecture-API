FROM node:14
WORKDIR /usr/src/clean-node-api
RUN npm install --only=prod
ARG MONGO_URL ENV MONGO_URL=$MONGO_URL

