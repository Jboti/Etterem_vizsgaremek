const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: "API Dokumentáció",
    description: "Az API leírása.",
  },
  host: "localhost:3000",
  schemes: ['http'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outPutFile = './swagger_output.json'
const endpointsFiles = ['./api/routes/*.js']

swaggerAutogen(outPutFile, endpointsFiles, doc).then(() => {
  require('./app.js')
})
