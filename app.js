var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').createServer(app);
var socket = require('socket.io');
var path = require('path');
var logger = require('morgan');
require('./models/Users');
var User = mongoose.model('User');
var users = {};
mongoose.connect('mongodb://localhost/chat');

app.use(express.static(path.join(__dirname,'public')));
app.use(logger('dev'));

app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname,'public','chat.html'));
});

http.listen(3002, function(){
	console.log('listening on 3002');
});

var server = socket(http);

server.on('connection', function(client){
	console.log('a user connected');
	client.on('join', function(name){
		console.log('Join recieved from' + name);
		User.find({username:name})
		.limit(1)
		.exec(function(err, user){
			console.log('result ' + user);
			if(err){
				console.log('Find username failed');
				next(err);
			}

			if(!user || user == ""){
				console.log('Unique user');
				var user = new User({username: name});
				user.save(function(err, user){
					if(err){
						console.log('Saving user failed');
						next(err);
					}else{
						console.log('Connection Success!');
						users[client.id] = user;				
						client.emit('update', 'connected');
						server.sockets.emit('update', user + ' has joined');
						server.sockets.emit('update-users', users);
						client.emit('connectionSuccess', user);
					}					
				});				
			}else{
				client.emit('userRedundant');
				console.log('User already exists');
			}

		});
		
	});

	client.on('send', function(msg){
		server.sockets.emit('chat', users[client.id], msg);		
	});

	client.on('disconnect', function(){
		server.sockets.emit('update', users[client.id] + ' has left');
		delete users[client.id];		
	});

});

