console.log('client.js sourced');

// document ready
$(document).ready(function(){
  console.log('document ready');
  listToDos();

  // create button click
  $('.createButton').on('click', function(){
    console.log("create button clicked");
    var newToDo=createToDo();
    $.ajax ({
      url: '/createToDo',
      type:"POST",
      dataType: 'JSON',
      data: newToDo,
      success: function(data){
        console.log('ajax success: ', data.success);
        listToDos();
      } //end success
    }); //end ajax call
  }); // end create button

  // complete button click
  $('body').on('click', '.completeButton', function(){
    console.log(('complete button clicked'));
    var completedToDo=completeToDo();
    $.ajax({
      url: '/completeToDo',
      type: 'PUT',
      dataType: 'JSON',
      data: completedToDo,
      success: function(data){
      console.log('ajax success: ', data.success);
        listToDos();
      } //end success
    }); //end ajax call
  }); // end complete button

  // delete button click
  $('body').on('click', '.deleteButton', function(){
    console.log(('delete button clicked'));
    var deletedToDo=deleteToDo();
    $.ajax({
      url: '/deleteTodo',
      type: 'DELETE',
      dataType: 'JSON',
      data: deletedToDo,
      success: function(data){
      console.log('ajax success: ', data.success);
        listToDos();
      } //end success
    }); //end ajax call
  }; // end delete button
}); // end document ready

// display todos
var listToDos = function(){
  console.log('in listToDos');
  // begin ajax call
  $.ajax({
    url: '/listToDos',
    type: 'GET',
    dataType: 'JSON',
    success: function(data){
      console.log('got listToDos', data);
      // empty display div
      $('.display').empty();
      // loop through todo list
      for (var i = 0; i < data.length; i++) {
        // todo id
        var id = data[i].id;
        console.log(id);
        // todo text
        var text = data[i].text;
        console.log(text);
        // todo complete
        var complete = data[i].complete;
        console.log(complete);
        // create delete button
        var deleteButton = $('<button />', {
          class: 'deleteButton',
          id: id,
          text: 'Delete'
        });
        // puts list onto the dom
        switch (complete) {
          // if completed
          case (true):
            var completed = $('<div />', {class: 'completed'}).append('To Do: ' + text + '<br>').append(deleteButton);
            $('.display').append(completed);
            break;
          // else
          default:
            var completeButton = $('<button />', {
              class: 'completeButton',
              id: id,
              text: 'Completed!'
            });
            var outstanding = $('<div />', {class: 'outstanding'}).append('To Do: ' + text + '<br>').append(completeButton).append(deleteButton);
            $('.display').append(outstanding);
        }
      }
    } // end success
  }); //end ajax call
}; // end list todos

// create new todo
var createToDo = function(){
  console.log('in createToDo');
  // get user input
  var text = $('#textIn').val();
  // assemble new todo object
  var newToDo = {
    'text': text
  };
  return newToDo;
}; // end createToDo

// update todo complete
var completeToDo = function(){
  console.log('in completeToDo');
  var toDone = $(this).attr('id');
  // assemble completed todo object
  var completedToDo = {
    'id': Number(toDone)
  };
  return completedToDo;
}); // end complete button

// delete todo from database
var deleteTodo = function(){
  console.log('in deleteTodo');
  var toGone = $(this).attr('id');
  // assemble deleted todo object
  var deletedToDo = {
    'id': Number(toGone)
  };
  return deletedToDo;
}); // end delete button
