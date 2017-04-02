const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const MongoClient = require('mongodb').MongoClient;
const compression = require('compression');
const ExpressPeerServer = require('peer').ExpressPeerServer;
require('dotenv').config();


// to learn more about express, https://zellwk.com/blog/crud-express-mongodb/

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/peerjs', ExpressPeerServer(server, {
  debug: true
}));


io.on('connection', socket => {
  socket.broadcast.emit('userConnect', 'New user connected');

  socket.on('message', message => {
    socket.broadcast.emit('message', {
      time: message.time,
      body: message.body,
      name: message.name
    });
    db.collection('chat').save(message, (err) => {
      if (err) return console.log(err);
    });
  });

  socket.on('typing', typing => {
    socket.broadcast.emit('typing', typing);
  });
});

var db;

MongoClient.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds161029.mlab.com:61029/express-chat-app`, (err, database) => {
  if (err) { return console.log(err); }
;  db = database;
  server.listen(process.env.PORT || 3000);
});

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).


app.get('/index', (req, res) => {
  db.collection('chat').find().toArray(function(err, results) {
    res.json({ results });
  });
});

app.delete('/', (req, res) => {
  db.collection('chat').remove(function(err, results) {
    res.json({ results });
  });
});

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

