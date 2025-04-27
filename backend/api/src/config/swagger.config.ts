import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:5005'
  };

const routes = ['../routes/booking.routes.ts', '../routes/profile.routes.ts', '../routes/events.routes.ts'];
const outputFile = './swagger_output.json'; // Файл, куда сохранится документация const endpointsFiles = ['./routes/*.js']; // Пути к файлам с маршрутами
swaggerAutogen(outputFile, routes, doc);