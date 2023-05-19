FROM node:19.3.0

RUN mkdir /web_react
WORKDIR /web_react

COPY . .

RUN npm install --legacy-peer-deps
RUN npm i react-scripts

EXPOSE 3001

CMD ["npm", "start"]