var room = 'looping';
var socket = io.connect('http://localhost');

// join room
socket.emit('join', { room: room});

// notify
socket.emit('state', { room: room, x: 2, y: 7, vx: 5, vy: 7 });

// receive
socket.on('state', function (data) {
    console.log(data);
});

// socket.emit('leave', { room: room});