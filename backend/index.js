import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import todoroute from "./routes/ToDoRoute.js";

dotenv.config();

const app  = express();
const PORT = process.env.port || 5000;

const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());
app.use(cors());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use('/todoRecodes', todoroute);


app.listen(PORT, () => console.log(`Listening on: ${PORT}`));


