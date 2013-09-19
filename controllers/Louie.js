module.exports = function (app, io, socket) {
    return {
        /*
         * join.
         */
        join: function (data) {
            var maxConnections = 4;
            if(io.sockets.clients('room').length < maxConnections) {
                socket.join(data.room);
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
        },

        /*
         * score
         */
        score: function (data) {
            console.log(data);
            io.sockets.in(data.room).emit('score', data);
        },

        /*
         * end
         */
        end: function (data) {
            var sockets = io.sockets.clients(data.room);

            // update position
            io.sockets.in(data.room).emit('position', data);

            // notify next player
            for(var i = 0, len = sockets.length; i < len; i++) {
                var curr = sockets[i];
                if(socket.id === curr.id) {
                    // its the turn for the next player (or the first if its the last)
                    var index = i + 1;
                    if(index == len) {
                        index = 0;
                    }

                    io.sockets.socket(sockets[i].id).emit('start', data);
                }
            }
        }
    }
};
