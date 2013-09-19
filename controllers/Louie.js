module.exports = function (app, socket) {
    return {
        /*
         * join.
         */
        join: function (data) {
            socket.join(data.room);
        },

        /*
         * leave.
         */
        leave: function (data) {
            socket.leave(data.room);
        },

        /*
         * state
         */
        state: function (data) {
            console.log(data);
            socket.broadcast.to(data.room).emit('state', data);
        }
    }
};
