FROM node:18.17.1
LABEL authors="Dastan"

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 5000
ENV PORT 5000

CMD ["node", "dist/main.js"]
