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

	socket.on('connectionSuccess', function(who){	
		$('#login').detach();
		$('#people').append("<li><strong><span class='text-success'>" + who.username + "</span></strong></li>");
	});

	$('#send').click(function(){
		var msg = $('#msg').val();
		socket.emit('send',  msg);
		$('#msg').val("");
	});

	socket.on('chat', function(who, msg){
		$('#msgs').append("<li><strong><span class='text-success'>" + who.username + "</span></strong> says: " + msg + "</li>");		
	});


	
});