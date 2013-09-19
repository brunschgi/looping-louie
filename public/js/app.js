var room = 'looping';
var socket = io.connect('http://localhost');

// join room
socket.emit('join', { room: room});

// notify
socket.emit('end', { room: room, x: 2, y: 7, vx: 5, vy: 7 });
socket.emit('score', { room: room });

// receive
socket.on('position', function (data) {
    // update position (status bar)
    console.log('update position to ' + data.id);
});

socket.on('start', function (data) {
    // its your turn -> draw louie
    console.log('start louie');

    setTimeout(function() {
        socket.emit('end', data);
    }, 1000);
});

socket.on('state', function (data) {
    // update state -> redraw players etc.
    console.log('update state');
});

socket.on('maximum reached', function(data) {
    // display maximum players reached message
    alert('only ' + data.maxConnections + ' players can play together');
});

// socket.emit('leave', { room: room});


window.onload = function() {
        
        var louisIsHere = false;
        
		var canvas = document.getElementById('canvas-louie');
		paper.setup(canvas);
		var view = paper.view;
		
		var tool = new paper.Tool();
		
        var louie = new paper.Path.Circle({
            center: view.bounds.leftCenter,
            radius: 70,
            fillColor: 'red'
        });
        
        var velocity = new paper.Point(10.0, 0.0);
        var acceleration = new paper.Point(0, 0.9);
        
        var updateLouis = function() {
          velocity.x += acceleration.x;
          velocity.y += acceleration.y;
          louie.position.x += velocity.x;
          louie.position.y += velocity.y;
          
          var hitBottom = louie.bounds.bottom >= view.bounds.bottom;
          var hitTop = louie.bounds.top <= view.bounds.top;
          var hitRight = louie.bounds.left > view.bounds.right;
          
          if (hitBottom) {
            velocity.y *= -0.8;
            louie.position.y = view.bounds.bottom - louie.bounds.height/2.0;
          }
          if (hitTop) {
            velocity.y *= -0.8;
            louie.position.y = louie.bounds.height/2.0;    
          }
          
          if (hitRight) {
            // notify
            socket.emit('end', {
                room: room, 
                x: 2, 
                y: 7,
                vx: 5, 
                vy: 7
            });
            louie.position.x = 0;
          }
        };
        
        view.onFrame = function() {        
          updateLouis();
          
          
        };
        
        tool.onMouseDrag = function(event) {
            velocity.y += event.delta.y / 10.0;
        };
		
	}
