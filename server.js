// server.js
const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));


  require('./app/routes')(app, {});
  app.listen(port, function () {
    console.log('We are live on ' + port);
});
