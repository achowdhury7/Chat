$(document).ready(function(){
	var socket = io.connect('http://localhost:3002',{
		reconnection: false
	});

	$('form').submit(function(event){
		event.preventDefault();
	})

	$('#join').click(function(){
		var name = $('#name').val();
		if (name != "") {
			socket.emit('join', name);
			console.log('Emit join event');						
		}else{
			console.log("Please enter a name");
		}
	});

	socket.on('userRedundant', function(){
		$('#error').text('User already exists. Please try again ');
	});

	socket.on('existing-users', function(users){
		console.log(users);		
		for (user in users){
			if(users.hasOwnProperty(user)){
				//console.log(users[user].username);				
				$('#people').append("<li id=" + users[user]._id + "><strong><span class='text-success'>" + users[user].username + "</span></strong></li>");					
			}
		}
	});

	socket.on('update-users', function(user){
		console.log(user);
		$('#people').append("<li id=" + user._id + "><strong><span class='text-success'>" + user.username + "</span></strong></li>");
	});

	socket.on('connectionSuccess', function(who){	
		$('#login').detach();		
	});

	$('#send').click(function(){
		var msg = $('#msg').val();
		socket.emit('send',  msg);
		$('#msg').val("");
	});	

	socket.on('chat', function(who, msg){
		$('#msgs').append("<li><strong><span class='text-success'>" + who.username + "</span></strong> says: " + msg + "</li>");		
	});

	socket.on('disconnection-update', function(user){
		console.log(user);
		$('#'+ user._id).remove();
	})

	socket.on('updated-list', function(users){
		console.log(users);
	});


	
});