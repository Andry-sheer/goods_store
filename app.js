import express from 'express';
import morgan from 'morgan';
import router from './routes/test.router.js';
import cors from 'cors';
import { corsOptions } from './config/cors.config.js';

const app = express();

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : true }))


app.use('/', router)


app.use((req, res)=> {
  res.status(404).json({
    status : 404,
    error : `page for url ${req.originalUrl} not found`
  })
});


app.use((err, req, res, next)=> {
  console.error(err.stack);
  res.status(500).json({
    status : 500,
    error : 'Internal app Error'
  })
});

export default app;