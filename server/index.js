require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const pg = require('pg');

const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('/boardGamePosts', (req, res, next) => {
  const { lender, game, gameId, gameImg, comments } = req.body;
  if (!lender || !game || !gameId || !gameImg || !comments) {
    throw new ClientError(400, 'lender, game, gameId, gameImg, and comments are required fields');
  }
  const sql = `
    insert into "posts" ("lenderName", "gameName", "gameApiId", "gameThumbNail", "lenderComments")
    values ($1, $2, $3, $4, $5)
    returning *;
  `;
  const params = [lender, game, gameId, gameImg, comments];
  db.query(sql, params)
    .then(result => {
      const [post] = result.rows;
      res.status(201).send(post);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
