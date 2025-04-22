FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 5005

CMD ["npm", "run", "start"]