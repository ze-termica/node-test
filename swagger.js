const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Mauricio's Cognizant test",
        description: "Node test for Vivo project"
    },
    host: "localhost:3000",
    schemes: ['http']
}

const outputFile = './swagger/swagger_output.json'
const endpointsFiles = ['./routes/company.js', './routes/site.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server/index.js')
});