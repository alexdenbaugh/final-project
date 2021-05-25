require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('./boardGamePosts', (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(req.body);
});

app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
