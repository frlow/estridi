FROM node:alpine
COPY dist /app
WORKDIR /app
RUN npm i prettier
VOLUME /config
EXPOSE 4005
CMD node editor.js -d /config
