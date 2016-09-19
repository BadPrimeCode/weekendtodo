console.log('app.js sourced');

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/weekendtodo';

// port decision
var port = process.env.PORT || 3030;

// spin up server
app.listen(port, function() {
  console.log('listening on port whatever');
});

// set up public folder
app.use(express.static('public'));

// base url
app.get('/', function(req, res){
  console.log('base URL hit');
  res.sendFile(path.resolve('public/index.html'));
}); //end base url

// list todos
app.route('/listToDos')
  .get(function(req, res){
    console.log('/listToDos hit');
    // pg connect
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log('error in list');
      } else {
        console.log('connected to list');
        // results array
        var resultsArray = [];
        // get all the things from database
        var query = client.query('SELECT * FROM todo ORDER BY complete');
        // and push them into array
        query.on('row', function(row){
          resultsArray.push(row);
        });
        // end query
        query.on('end', function(){
          done();
          return res.send(resultsArray);
        });
      }
    }); // end pg connect
  }) // end list todos

  // add new todo
  app.post(urlencodedParser, function(req, res){
    console.log('/createToDo hit', req.body);
    // get text from client
    var text = req.body.text;
    // pg connect
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log('error in create');
      } else {
        console.log('connected to create');
        console.log(text);
        // put in database
        client.query('INSERT INTO todo (text) VALUES ($1)', [text]);
        res.send({success: true});
      }
    }); // end pg connect
  }) // end new todo

  // complete todo
  app.put(urlencodedParser, function(req, res){
    console.log('/completeToDo hit', req.body);
    // get id
    var id = req.body.id;
    // pg connect
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log('error in complete');
      } else {
        console.log('connected to complete');
        // update database
        client.query('UPDATE todo SET complete = $1 WHERE id = $2', [true, id]);
        res.send({success: true});
      }
    }); // end pg connect
  }) // end complete todo

  // delete todo
  app.delete(urlencodedParser, function(req, res){
    console.log('/deleteToDo hit', req.body);
    // get id
    var id = req.body.id;
    // pg connect
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log('error in delete');
      } else {
        console.log('connected to delete');
        // delete from database
        client.query('DELETE FROM todo WHERE id = $1', [id]);
        res.send({success: true});
      }
    }); // end pg connect
  }); // end delete todo
