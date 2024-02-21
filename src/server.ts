/* eslint-disable no-console */
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/first
import app from './app';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('App listen on port 8000👻. http://localhost:8000');
});
