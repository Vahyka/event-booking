import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
      title: 'My Auth Service',
      description: 'Description'
    },
    host: 'localhost:5004'
  };

const routes = ['../routes/auth.routes.ts'];
const outputFile = './swagger_output.json'; // Файл, куда сохранится документация const endpointsFiles = ['./routes/*.js']; // Пути к файлам с маршрутами
swaggerAutogen(outputFile, routes, doc);