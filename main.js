const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const env = config.env;
const MongoClient = require('mongodb').MongoClient;

const app = express();
const routes = require('./routes');
const logger = require('./utils/logger');
const expressSwagger = require('express-swagger-generator')(app);

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'MCDB Service Definitions',
            title: 'MCDB Services',
            version: '1.0.0',
        },
        host: `${env.HOST}:${env.HOSTPORT}/api`,
        produces: ['application/json'],
        schemes: [env.SCHEME],
    },
    basedir: __dirname,
    files: ['./models/*.js', './services/*.js'],
};

expressSwagger(swaggerOptions);

const dbConfig = config.dbConfig;

const client = new MongoClient(
    `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DATABASEHOST}:${dbConfig.DATABASEPORT}/${dbConfig.DATABASE}`
);

const test = async () => {
    await client
        .connect()
        .then(() => console.log('Connected!!!'))
        .catch((err) => console.log(err));

    const db = client.db('mcdb');
    const games = db.collection('games');

    await client.close();
};

app.get('/', (req, res) => {
    res.send('App is working');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Permission-Token'
    );
    next();
});
app.use('/api', routes);

app.listen(env.HOSTPORT, async () => {
    app.listen(env.PORT, () =>
        logger.debug(`App listening on port ${env.HOSTPORT}`)
    );
});

module.exports = {
    app,
};
