console.log('app.js sourced');

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/weekendtodo';

// port decision
// var port = process.env.PORT || 3030;

// spin up server
app.listen('3030', function() {
  console.log('listening on port 3030');
});

// set up public folder
app.use(express.static('public'));

// base url
app.get('/', function(req, res){
  console.log('base URL hit');
  res.sendFile(path.resolve('public/index.html'));
}); //end base url
