module.exports = function (app, io, socket) {

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
        { normal : '#f7ec32', highlighted: '#db00c0' },
        { normal : '#f9eb00', highlighted: '#f7ec32' },
        { normal : '#019ac4', highlighted: '#01c2f7' },
        { normal : '#ce0014', highlighted: '#ff021b' }
    ];

    var first = true;

    var model = {
        players: {
           /* socketId : {
            'lives': 3
           } */
        },
        position: 0
    };

    return {
        /*
         * join.
         */
        join: function (data) {
            var maxConnections = 4;
            if(io.sockets.clients(data.room).length < maxConnections) {
                socket.join(data.room);
                model.players[socket.id] = { lives: 3, color: colors[io.sockets.clients(data.room).length - 1] };

                // notify all about the changed game state (additional player)
                io.sockets.in(data.room).emit('state', model);

                if(first) {
                    socket.emit('start', {});
                    first = false;
                }
            }
            else {
                socket.emit('maximum reached', { maxConnections: maxConnections})
            }
        },

        /*
         * leave.
         */
        leave: function (data) {
            socket.leave(data.room);

            delete model.players[socket.id];

            // notify all about the changed game state (lost player)
            io.sockets.in(data.room).emit('state', model);
        },


        /*
         * score
         */
        score: function (data) {
            var player = model.players[socket.id];
            player.lives--;

            // notify all about the changed game state (updated lives)
            io.sockets.in(data.room).emit('state', model);
        },

        /*
         * end
         */
        end: function (data) {
            var sockets = io.sockets.clients(data.room);

            // notify next player
            for(var i = 0, len = sockets.length; i < len; i++) {
                var curr = sockets[i];
                if(socket.id === curr.id) {
                    // its the turn for the next player (or the first if its the last)
                    var index = i + 1;
                    if(index == len) {
                        index = 0;
                    }

                    // notify next player
                    io.sockets.socket(sockets[index].id).emit('start', data);

                    // notify all about the next position
                    io.sockets.in(data.room).emit('position', { id : sockets[index].id });
                }
            }
        }
    }
};
