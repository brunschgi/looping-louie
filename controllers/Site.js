module.exports = function (app) {
    return {
        /*
         * start.
         */
        index: function (req, res) {
            var title = 'Looping Louie';
            res.render('louie.html', { title: title });
        }
    }
};
