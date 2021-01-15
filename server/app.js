let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();
let fs = require('fs');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = fs.readFileSync('./swagger/swagger_output.json');
app.use('/doc', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerFile)));

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());

consign()
    .include('api')
    .then('routes')
    .exclude('api/bitmap.test.js')
    .exclude('api/hero.test.js')
    .into(app);

module.exports = app;