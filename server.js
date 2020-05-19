import dotenv from 'dotenv';
dotenv.config({
  path: `${process.env.ENVIRONMENT}.env`
});

import app from './packages/app/index.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
