import express from 'express';
import cors from 'cors';
import connectDatabase from './database/db.js';
import routes from './routes.js';
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from '../swagger.json' assert {type: 'json'}



// GERAL CONFIG
const app = express();
const port = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));



// Middlewares
app.use(express.json());
app.use(cors());


app.use(routes);

connectDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log('Servidor rodando na porta:', port);
        });
})
    .catch((err) => console.log('Ocorreu um erro ao iniciar servidor', err));

