FROM node:20
WORKDIR /backend
COPY . .
RUN npm install
CMD [ "node", "index.js" ]
EXPOSE 5000
