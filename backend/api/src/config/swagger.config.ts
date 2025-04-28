import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:5005'
  };

const routes = ['../routes/booking.routes.ts', '../routes/events.routes.ts'];
const outputFile = './swagger_output.json';
swaggerAutogen(outputFile, routes, doc);