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

        chickenIsAboutLeaving: function(data) {
            data.room = room;
            data.msg = 'chickenArrives';
            socket.emit('tellNext', data );
        },
        
        louieIsAboutLeaving: function(data) {
            data.room = room;
            socket.emit('end', data);
        }

    };

    app.chicken = new Chicken(app);
    app.predecessorsChicken = new PredecessorChicken(app);
    app.louie = new Louie(app);

    view.onFrame = function() {
        app.louie.update();
        app.chicken.update();
        app.predecessorsChicken.update();
    };

    view.onResize = function() {
        app.louie.resize();
        app.chicken.resize();
    };

    tool.onMouseDrag = function(event) {
        app.louie.push(event.delta);
    };

    socket.on('start', function (data) {
        console.log('start louie');
        app.louie.arrives(data);
    });

    socket.on('msgFromPredecessor', function(data) {
        console.log('message from predecessor: ' + data.msg);
        if (data.msg == 'chickenArrives') {
            app.predecessorsChicken.arrives(data);
        }
         
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


