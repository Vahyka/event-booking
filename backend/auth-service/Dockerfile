FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 5004

CMD ["npm", "run", "dev"]