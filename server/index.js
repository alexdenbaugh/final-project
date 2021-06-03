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

app.post('/api/boardGamePosts', (req, res, next) => {
  let { lender, game, gameId, gameImg, comments, thumbnail, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age, year } = req.body;
  gameId = parseInt(gameId, 10);
  if (!lender || !game || !gameId || !gameImg || !comments || !thumbnail || !description || !minPlayers || !maxPlayers || !minPlayTime || !maxPlayTime || !age || !year) {
    throw new ClientError(400, 'lender, game, gameId, gameImg, comments, thumbnail, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age and year are required fields');
  }
  const sql = `
    insert into "posts" ("lenderName", "gameName", "gameId", "thumbnail",
                     "lenderComments", "image", "description", "minPlayers",
                     "maxPlayers", "minPlayTime", "maxPlayTime", "ageLimit",
                     "yearPublished")
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    returning *;
  `;
  const params = [lender, game, gameId, thumbnail, comments, gameImg, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age, year];
  db.query(sql, params)
    .then(result => {
      const [post] = result.rows;
      res.status(201).send(post);
    })
    .catch(err => next(err));
});

app.get('/api/boardGames/:game', (req, res, next) => {
  if (!req.params.game) {
    throw new ClientError(400, 'game is a required field');
  }
  const gameName = req.params.game.split(' ').join('%20');
  const init = {
    mode: 'no-cors'
  };
  fetch(`http://www.boardgamegeek.com/xmlapi/search?search=${gameName}`, init)
    .then(response => response.text())
    .then(xml => {
      const parser = new xml2js.Parser();
      parser.parseStringPromise(xml)
        .then(result => {
          const json = JSON.stringify(result);
          const games = JSON.parse(json);
          if (!games.boardgames.boardgame) {
            throw new ClientError(404, 'game not found');
          }
          let gameInfo = games.boardgames.boardgame.reduce((list, listItem) => {
            const {
              $: {
                objectid: gameId
              },
              name: [
                {
                  _: name
                }
              ]
            } = listItem;
            if (name) {
              const lowerCaseName = name.toLocaleLowerCase('en-US');
              const lowerCaseUser = gameName.toLocaleLowerCase('en-US');
              if (lowerCaseName.startsWith(lowerCaseUser.split('%20').join(' '))) {
                list.push({ name, gameId });
              }
            }
            return list;
          }, []);
          if (gameInfo.length > 10) {
            gameInfo = gameInfo.slice(0, 10);
          }
          res.status(200).send(gameInfo);

        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/boardGameInfo/:gameId', (req, res, next) => {
  const gameId = parseInt(req.params.gameId, 10);
  if (!req.params.gameId) {
    throw new ClientError(400, 'gameId is a required field.');
  } else if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new ClientError(400, 'gameId must be a positive integer.');
  }
  const init = {
    mode: 'no-cors'
  };
  fetch(`http://www.boardgamegeek.com/xmlapi/boardgame/${gameId}`, init)
    .then(response => response.text())
    .then(xml => {
      const parser = new xml2js.Parser();
      parser.parseStringPromise(xml)
        .then(game => {
          if (game.boardgames.boardgame.length < 1) {
            throw new ClientError(404, `Could not find game with id: ${gameId}.`);
          }
          let [
            {
              thumbnail: [thumbnailUrl],
              image: [imageUrl],
              minplaytime: [minPlayTime],
              maxplaytime: [maxPlayTime],
              minplayers: [minPlayers],
              maxplayers: [maxPlayers],
              description: [description]
            }
          ] = game.boardgames.boardgame;
          description = description.split('<br/><br/>').join('/n');
          const gameInfo = {
            thumbnailUrl,
            imageUrl,
            minPlayTime,
            maxPlayTime,
            minPlayers,
            maxPlayers,
            description
          };
          res.status(200).send(gameInfo);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/boardGamePosts', (req, res, next) => {
  const sql = `
    select "postId"
           "lenderName",
           "gameName",
           "gameId",
           "thumbnail",
           "lenderComments",
           "image",
           "description",
           "minPlayers",
           "maxPlayers",
           "minPlayTime",
           "maxPlayTime",
           "ageLimit",
           "yearPublished"
      from "posts"
  order by "createdAt" desc
     limit 10;
  `;
  db.query(sql)
    .then(result => {
      const posts = result.rows;
      res.status(200).send(posts);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
