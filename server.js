// server.js
const express        = require('express');
const bodyParser     = require('body-parser');
const mysql          = require('mysql');
const app            = express();
const db             = require('./config/db');

const port = 8000; //server : 1337

app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection(db);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  require('./app/routes')(app,con, {});
  app.listen(port, function() {
    console.log('We are live on ' + port);
  });
});
