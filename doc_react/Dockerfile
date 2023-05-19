FROM node:19.3.0

RUN mkdir /web_react
WORKDIR /web_react

COPY . .

RUN npm install -g react-scripts
RUN npm install --legacy-peer-deps

EXPOSE 3001

CMD ["npm", "start"]