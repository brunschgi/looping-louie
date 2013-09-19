var room = 'looping';
var socket = io.connect('http://localhost');

// join room
socket.emit('join', { room: room});

socket.on('maximum reached', function(data) {
    // display maximum players reached message
    alert('only ' + data.maxConnections + ' players can play together');
});

// receive
socket.on('position', function (data) {
    // update position (status bar)
    console.log('update position to ' + data.id);
});

socket.on('start', function (data) {
    louis.arrives(data);
});

socket.on('state', function (data) {
    // update state -> redraw players etc.
    console.log('update state');
});


// socket.emit('leave', { room: room});

var controller = {
    pickedChicken: function() {
        socket.emit('score', { room: room });
    },
    
    isAboutLeaving: function(data) {
        data.room = rooom;
        socket.emit('end', data);
    }    

};

var louie = new Louis(controller);


window.onload = function() {    
    
    var canvas = document.getElementById('canvas-louie');
    paper.setup(canvas);
    var view = paper.view;    
    var tool = new paper.Tool();
        
    
    view.onFrame = function() {   
      if (louis.isHere) {
          louis.updatePosition(view);
      }
    };
    
    tool.onMouseDrag = function(event) {
        louis.push(event.delta);
    };
    
}
	

