FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY ./dist .

EXPOSE 80

ARG ALLOWED_ENDPOINTS
ENV ALLOWED_ENDPOINTS=$ALLOWED_ENDPOINTS

ARG CONTENT_TYPES
ENV CONTENT_TYPES=$CONTENT_TYPES

CMD [ "npm", "start" ]