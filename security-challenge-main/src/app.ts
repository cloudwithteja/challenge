import express from 'express';
import cors from 'cors';
import { authenticationRouter } from './routes/authentication';
import { notesRouter } from './routes/notes';
import { config } from './config';

const app = express();
const port = config.servicePort;
app.use(cors());
app.use(express.json());

app.use('/authentication', authenticationRouter);
app.use('/users', notesRouter);

app.get('/', (_req, res) => {
  res.send('Hello, TypeScript Node Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
