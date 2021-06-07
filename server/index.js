require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

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
  let { lender, lenderId, game, gameId, gameImg, comments, thumbnail, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age, year } = req.body;
  if (!lender || !lenderId || !game || !gameId || !gameImg || !comments || !thumbnail || !description || !minPlayers || !maxPlayers || !minPlayTime || !maxPlayTime || !age || !year) {
    throw new ClientError(400, 'lender, lenderId, game, gameId, gameImg, comments, thumbnail, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age and year are required fields');
  }
  lenderId = parseInt(lenderId, 10);
  gameId = parseInt(gameId, 10);
  minPlayers = parseInt(minPlayers, 10);
  maxPlayers = parseInt(maxPlayers, 10);
  minPlayTime = parseInt(minPlayTime, 10);
  maxPlayTime = parseInt(maxPlayTime, 10);
  age = parseInt(age, 10);
  year = parseInt(year, 10);
  const sql = `
    insert into "posts" ("lenderName", "gameName", "gameId", "thumbnail",
                     "lenderComments", "image", "description", "minPlayers",
                     "maxPlayers", "minPlayTime", "maxPlayTime", "ageLimit",
                     "yearPublished", "lenderId")
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    returning *;
  `;
  const params = [lender, game, gameId, thumbnail, comments, gameImg, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, age, year, lenderId];
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
          const [
            {
              thumbnail: [thumbnailUrl],
              image: [imageUrl],
              minplaytime: [minPlayTime],
              maxplaytime: [maxPlayTime],
              minplayers: [minPlayers],
              maxplayers: [maxPlayers],
              description: [description],
              age: [age],
              yearpublished: [yearPublished]
            }
          ] = game.boardgames.boardgame;
          const gameInfo = {
            thumbnailUrl,
            imageUrl,
            minPlayTime,
            maxPlayTime,
            minPlayers,
            maxPlayers,
            description,
            age,
            yearPublished
          };
          res.status(200).send(gameInfo);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/boardGamePosts', (req, res, next) => {
  const sql = `
    select "postId",
           "lenderName",
           "lenderId",
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

app.get('/api/boardGamePosts/:postId', (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);
  if (!req.params.postId) {
    throw new ClientError(400, 'postId is a required field.');
  } else if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a positive integer.');
  }
  const sql = `
    select "postId",
           "lenderName",
           "lenderId",
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
     where "postId" = $1;
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const [post] = result.rows;
      if (!post) {
        throw new ClientError(404, `Could not find post with id ${postId}`);
      }
      res.status(200).send(post);
    })
    .catch(err => next(err));
});

app.get('/api/boardGamePosts/search/:value', (req, res, next) => {
  const search = req.params.value;
  if (!search) {
    throw new ClientError(400, 'value is a required field.');
  }
  const sql = `
    select "postId",
           "lenderName",
           "lenderId",
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
     where to_tsvector("gameName" || ' ' || "lenderName") @@ to_tsquery($1)
  order by "createdAt" desc
     limit 10;
  `;
  const params = [search];
  db.query(sql, params)
    .then(result => {
      const posts = result.rows;
      if (posts.length < 1) {
        throw new ClientError(404, 'no posts were found');
      } else {
        res.status(200).send(posts);
      }
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
             values         ($1, $2)
          returning "userId", "username", "createdAt";
      `;
      const params = [username, hashedPassword];
      db.query(sql, params)
        .then(result => {
          const [user] = result.rows;
          res.status(201).send(user);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.post('/api/messages', (req, res, next) => {
  let { senderId, senderName, recipientId, content, postId } = req.body;
  if (!senderId || !senderName || !recipientId || !content || !postId) {
    throw new ClientError(400, 'senderId, senderName, recipientId, content, postId are required fields');
  }
  senderId = parseInt(senderId, 10);
  recipientId = parseInt(recipientId, 10);
  postId = parseInt(postId, 10);
  const sql = `
    insert into "messages" ("senderId", "senderName", "recipientId", "content", "postId")
         values ($1, $2, $3, $4, $5)
      returning *;
  `;
  const params = [senderId, senderName, recipientId, content, postId];
  db.query(sql, params)
    .then(result => {
      const [message] = result.rows;
      res.status(201).send(message);
    })
    .catch(err => next(err));
});

app.get('/api/messages/:userId', (req, res, next) => {
  let { userId } = req.params;
  userId = parseInt(userId, 10);
  if (!userId) {
    throw new ClientError(400, 'userId is a required field.');
  } else if (!Number.isInteger(userId) || userId <= 0) {
    throw new ClientError(400, 'userId must be a positive integer.');
  }
  const sql = `
    select  "m"."messageId" as "messageId",
            "m"."senderId" as "senderId",
            "m"."senderName" as "senderName",
            "m"."recipientId" as "recipientId",
            "m"."content" as "content",
            "m"."postId" as "postId",
            "m"."createdAt" as "createdAt",
            "p"."lenderName" as "lenderName"
       from "messages" as "m"
       join "posts" as "p" using ("postId")
      where "senderId" = $1 or "recipientId" = $2
   order by "createdAt" desc;
  `;
  const params = [userId, userId];
  db.query(sql, params)
    .then(result => {
      const messages = result.rows;
      res.status(200).send(messages);
    })
    .catch(err => next(err));
});

app.get('/api/message/convo/:userId/:otherId', (req, res, next) => {
  let { userId, otherId } = req.params;
  userId = parseInt(userId, 10);
  otherId = parseInt(otherId, 10);
  if (!userId || !otherId) {
    throw new ClientError(400, 'Ids are required.');
  } else if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(otherId) || otherId <= 0) {
    throw new ClientError(400, 'Id must be a positive integer.');
  }
  const sql = `
    select  "m"."messageId" as "messageId",
            "m"."senderId" as "senderId",
            "m"."senderName" as "senderName",
            "m"."recipientId" as "recipientId",
            "m"."content" as "content",
            "m"."postId" as "postId",
            "m"."createdAt" as "createdAt",
            "p"."lenderName" as "lenderName"
       from "messages" as "m"
       join "posts" as "p" using ("postId")
      where ("senderId" = $1 and "recipientId" = $2) or ("senderId" = $2 and "recipientId" = $1)
   order by "createdAt";
  `;
  const params = [userId, otherId];
  db.query(sql, params)
    .then(result => {
      const messages = result.rows;
      res.status(200).send(messages);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
