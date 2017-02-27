const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// to learn more about express, https://zellwk.com/blog/crud-express-mongodb/

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', socket => {
  socket.on('message', message => {
    socket.broadcast.emit('message', {
      time: message.time,
      body: message.body,
      name: message.name
    });

    db.collection('chat').save(message, (err, result) => {
      if (err) return console.log(err);

      console.log('saved to database');
    });
  });
});

var db;

MongoClient.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds161029.mlab.com:61029/express-chat-app`, (err, database) => {
  if (err) { return console.log(err); }

  db = database;
  server.listen(process.env.PORT || 3000);
});



app.get('/index', (req, res) => {
  db.collection('chat').find().toArray(function(err, results) {
    res.json({ results });
  });
});
