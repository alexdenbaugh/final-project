require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

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

app.get('/api/boardGames/:game', (req, res, next) => {
  const game = req.params.game;
  // console.log(game)
  // let header = new Headers();
  const init = {
    mode: 'no-cors'
  };
  fetch(`http://www.boardgamegeek.com/xmlapi/search?search=${game}`, init)
    .then(response => response.text())
    .then(xml => {
      const parser = new xml2js.Parser();
      parser.parseStringPromise(xml)
        .then(result => {
          // console.log(JSON.stringify(result))
          const json = JSON.stringify(result);
          const games = JSON.parse(json);
          const gameIds = games.boardgames.boardgame
            .map(game => {
              return game.$.objectid;
            });
          // console.log(gameIds)
          return gameIds;
        })
        .then(gameIds => {
          fetch(`http://www.boardgamegeek.com/xmlapi/boardgame/${gameIds.join(',')}`, init)
            .then(response => response.text())
            .then(xmlGames => {
              const parserGames = new xml2js.Parser();
              parserGames.parseStringPromise(xmlGames)
                .then(resultGames => {
                  // console.log(resultGames.boardgames.boardgame[0].thumbnail[0])
                  const data = resultGames.boardgames.boardgame.map(g => {
                    return g.thumbnail[0] ? g.thumbnail[0] : '';
                  });
                  res.status(200).send(data);

                });
            });
          // console.log('here are the games:', gameIds)

        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
