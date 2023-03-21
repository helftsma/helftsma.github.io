#FROM node:14.20-alpine
#WORKDIR /usr/src/app
#COPY nanoindentation-dashboard/package*.json ./
#RUN npm install -g @angular/cli
#RUN npm install
#RUN npm ci
#COPY . ./
#ENTRYPOINT npm run testspec

FROM node:18.15.0-alpine
RUN apk add chromium
WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY ./nanoindentation-dashboard/package.json ./nanoindentation-dashboard/package-lock.json ./nanoindentation-dashboard/karma.conf.js ./nanoindentation-dashboard/angular.json ./nanoindentation-dashboard/tsconfig.spec.json ./nanoindentation-dashboard/tsconfig.app.json ./nanoindentation-dashboard/tsconfig.json ./
RUN npm ci
COPY ./nanoindentation-dashboard .
ENTRYPOINT npm run test:ci