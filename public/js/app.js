var room = 'looping';
var socket = io.connect('http://' + document.location.hostname);

window.onload = function() {

    // display splash screen
    setTimeout(function() {
        var splash = document.body;
        splash.className = 'animate';

        var canvas = document.getElementById('canvas-louie');
        paper.setup(canvas);
        var view = paper.view;
        var tool = new paper.Tool();
        var groundHeightScale = 1 / 6;


        var app = {
            view: view,
            predecessorsChicken: {},
            chickenId: 0,
            player: {},

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

        app.louie = new Louie(app, groundHeightScale / 2);
        app.statusBar = new StatusBar(app);

        view.onFrame = function() {
            app.louie.onFrame();
            if (app.chicken)
                app.chicken.onFrame();
            for(var i in app.predecessorsChicken) {
                if(app.predecessorsChicken.hasOwnProperty(i)) {
                    if (app.predecessorsChicken[i].isActive())
                        app.predecessorsChicken[i].onFrame();
                    else
                        delete app.predecessorsChicken[i];
                }
            }
        };

        view.onResize = function() {
            app.louie.resize();
            app.chicken.resize();
            app.statusBar.resize();
        };

        tool.onMouseDrag = function(event) {
            app.louie.push(event.delta);
        };

        socket.on('welcome', function (data) {
            app.player = data;
            app.statusBar.ground(data.color.normal, groundHeightScale);
            app.chicken = new Chicken(app, 'chicken_' + app.player.color.chickenColor + '-', data.lives, groundHeightScale / 2);
        });

        socket.on('start', function (data) {
            app.louie.appears(data);
        });

        socket.on('msgFromPredecessor', function(data) {
            if (data.msg == 'chickenArrives') {
                var chicken = new PredecessorChicken(app, groundHeightScale / 2);
                chicken.appears(data);
                app.predecessorsChicken[app.chickenId++] = chicken;
            }

        });

        // receive
        socket.on('position', function (data) {
            // update position (status bar)
            app.statusBar.updatePosition(data);
        });


        socket.on('state', function (data) {
            // update state -> redraw players etc.
            app.statusBar.update(data);
        });


        // join room
        socket.emit('join', { room: room});

        socket.on('maximum reached', function(data) {
            // display maximum players reached message
            alert('only ' + data.maxConnections + ' players can play together');
        });

        // socket.emit('leave', { room: room});
    }, 2000);
}


