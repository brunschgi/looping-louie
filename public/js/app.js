var room = 'looping';
var socket = io.connect('http://localhost');

// join room
socket.emit('join', { room: room});

socket.on('maximum reached', function(data) {
    // display maximum players reached message
    alert('only ' + data.maxConnections + ' players can play together');
});

// socket.emit('leave', { room: room});

var controller = {
    pickedChicken: function() {
        socket.emit('score', { room: room });
    },

    isAboutLeaving: function(data) {
        data.room = room;
        socket.emit('end', data);
    }

};


window.onload = function() {

    var canvas = document.getElementById('canvas-louie');
    paper.setup(canvas);
    var view = paper.view;
    var tool = new paper.Tool();

    var louie = new Louie(controller);

    view.onFrame = function() {
        louie.updatePosition(view);
    };

    tool.onMouseDrag = function(event) {
        louie.push(event.delta);
    };

    socket.on('start', function (data) {
        console.log('start louie');
        louie.arrives(data);
    });


    // receive
    socket.on('position', function (data) {
        // update position (status bar)
        console.log('update position to ' + data.id);
    });


    socket.on('state', function (data) {
        // update state -> redraw players etc.
        console.log('update state');
    });


}


