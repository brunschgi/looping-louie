var room = 'looping';
var socket = io.connect('http://' + document.location.hostname);

// join room
socket.emit('join', { room: room});

socket.on('maximum reached', function(data) {
    // display maximum players reached message
    alert('only ' + data.maxConnections + ' players can play together');
});

// socket.emit('leave', { room: room});



window.onload = function() {

    var canvas = document.getElementById('canvas-louie');
    paper.setup(canvas);
    var view = paper.view;
    var tool = new paper.Tool();


    var app = {
        view: view,
        pickedChicken: function() {
            socket.emit('score', { room: room });
        },

        isAboutLeaving: function(data) {
            data.room = room;
            socket.emit('end', data);
        }

    };

    app.chicken = new Chicken(app);
    app.louie = new Louie(app);

    view.onFrame = function() {
        app.louie.update();
        app.chicken.update();
    };

    view.onResize = function() {
        app.louie.resize();
    };

    tool.onMouseDrag = function(event) {
        app.louie.push(event.delta);
    };

    socket.on('start', function (data) {
        console.log('start louie');
        app.louie.arrives(data);
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


