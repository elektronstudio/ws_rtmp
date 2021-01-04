FROM node:alpine
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY . .

RUN npm ci --prod

EXPOSE 8080

CMD [ "node", "index.js" ]