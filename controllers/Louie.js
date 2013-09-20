module.exports = function (app, io) {

    /**
     * events in:
     *
     * join -> join game
     * leave -> leave game
     * score -> got hitted
     * end -> im finished, its the next players turn
     *
     *
     * events out:
     *
     * state -> send model with player and position info
     * maximum reached -> you are not allowed to join (maximum reached)
     * start -> start drawing louie
     * position -> update position
     *
     */


    var colors = [
        { normal : '#a80093', highlighted: '#db00c0', chickenColor: 'black' },
        { normal : '#f9eb00', highlighted: '#faff00', chickenColor: 'yellow' },
        { normal : '#019ac4', highlighted: '#01c2f7', chickenColor: 'blue' },
        { normal : '#ce0014', highlighted: '#ff021b', chickenColor: 'red' },
        { normal : '#3d8902', highlighted: '#53bb03', chickenColor: 'green' }
    ];

    var first = true;

    var model = {
        players: {
           /* socketId : {
            'lives': 3,
            'color': { normal : '#f7ec32', highlighted: '#db00c0', chickenColor: 'black' },
           } */
        },
        position: 0
    };

    var findNext = function (room, socket, callback) {
        var sockets = io.sockets.clients(room);
        for(var i = 0, len = sockets.length; i < len; i++) {
            var curr = sockets[i];
            if(socket.id === curr.id) {
                // its the turn for the next player (or the first if its the last)
                var index = (i + 1) % len;
                callback(sockets[index]);
            }
        }

    };

    return {
        /*
         * join.
         */
        join: function (data, socket) {
            var maxConnections = 5;
            var numConnections = io.sockets.clients(data.room).length;
            if(numConnections < maxConnections) {
                socket.join(data.room);
                model.players[socket.id] = { lives: 3, color: colors[numConnections] };

                // notify all about the changed game state (additional player)
                io.sockets.in(data.room).emit('state', model);

                if(first) {
                    socket.emit('start', {});
                    model.position = socket.id;
                    first = false;
                }

                socket.emit('welcome', model.players[socket.id]);
            }
            else {
                socket.emit('maximum reached', { maxConnections: maxConnections})
            }
        },

        /*
         * leave.
         */
        leave: function (data, socket) {
            socket.leave(data.room);

            delete model.players[socket.id];

            // notify all about the changed game state (lost player)
            io.sockets.in(data.room).emit('state', model);
        },


        /*
         * score
         */
        score: function (data, socket) {
            var player = model.players[socket.id];

            if(player.lives > 0) {
                player.lives--;
            }

            // notify all about the changed game state (updated lives)
            io.sockets.in(data.room).emit('state', model);
        },

        /*
         * end
         */
        end: function (data, socket) {
            var sockets = io.sockets.clients(data.room);
            // notify next player
            findNext(data.room, socket, function(nextSocket) {
                model.position = nextSocket.id;

                // notify next player
                io.sockets.socket(nextSocket.id).emit('start', data);

                // notify all about the next position
                io.sockets.in(data.room).emit('position', { id : nextSocket.id });
            });
        },

        tellNext: function (data, socket) {
            findNext(data.room, socket, function(nextSocket) {
                // notify next player
                delete data.room;
                io.sockets.socket(nextSocket.id).emit('msgFromPredecessor', data);
            });
        }
    }
};
