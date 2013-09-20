/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    doT = require('express-dot'),
    cfg = require('./config'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);


/**
 * Environment configuration
 */

// all environments
app.set('port', process.env.PORT || cfg.site.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'dot');
app.engine('html', doT.__express);
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    // always expire -> disable caching
    app.use(function (req, res, next) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    });
}

// production only
if ('production' == app.get('env')) {
    app.use(express.errorHandler());
}

/**
 * Routes
 */

// app
var site = require('./controllers/Site')(app);
app.get('/', site.index);

// sockets
var louie = require('./controllers/Louie')(app, io);

io.sockets.on('connection', function (socket) {
    socket.on('join', function(data) {
        louie.join(data, socket);
    });
    socket.on('leave', function(data) {
        louie.leave(data, socket);
    });
    socket.on('score', function(data) {
        louie.score(data, socket);
    });
    socket.on('end', function(data) {
        louie.end(data, socket);
    });
    socket.on('tellNext', function(data) {
        louie.tellNext(data, socket);
    });
});


// create server
server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
