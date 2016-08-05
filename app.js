var app = require('express')();
var logger = require('morgan')
var socket = require('socket.io');
var users = {};

app.listen(3002);
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Content-Type, Accept"');
	next();
});
app.use(logger('dev'));

var server = socket.listen(app);

server.on('connection', function(client){
	client.on('join', function(name){
		users[client.id] = name;
		client.emit('update', 'connected');
		server.sockets.emit('update', name + ' has joined');
		server.sockets.emit('update-users', users);
	});

	client.on('send', function(msg){
		server.sockets.emit('chat', users[client.id], msg);		
	});

	client.on('disconnect', function(){
		server.sockets.emit('update', users[client.id] + ' has left');
		delete users[client.id];		
	});
});
