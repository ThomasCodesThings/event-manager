### compilation stage
FROM node:latest AS build

RUN mkdir /build
WORKDIR /build

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]



