import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

// env vars
const port = process.env.PORT || 3000;
const dbURL = process.env.DB_URL as string;

mongoose.connect(dbURL).then(() => console.log('DB connection established'));

app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`);
});
