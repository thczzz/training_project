FROM node:19.3.0

RUN mkdir /web_react
WORKDIR /web_react

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]