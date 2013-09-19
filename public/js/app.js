var room = 'looping';
var socket = io.connect('http://localhost');

// join room
socket.emit('join', { room: room});

// notify
socket.emit('end', { room: room, x: 2, y: 7, vx: 5, vy: 7 });
socket.emit('score', { room: room, lives: 2 });

// receive
socket.on('position', function (data) {
    // update position (status bar)
    console.log('update position');
});

socket.on('start', function (data) {
    // its your turn -> draw louie
    console.log('start louie');

    setTimeout(function() {
        socket.emit('end', data);
    }, 1000);
});

socket.on('score', function (data) {
    // someone got hitted -> update score
    console.log('update score');
});

socket.on('maximum reached', function(data) {
    // display maximum players reached message
    alert('only ' + data.maxConnections + ' players can play together');
});

// socket.emit('leave', { room: room});