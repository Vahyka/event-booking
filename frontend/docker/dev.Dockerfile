FROM node:18-alpine

WORKDIR /app/front
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]