module.exports = function(io, socket) {
    socket.join('defaultRoom');
	io.to('defaultRoom').emit('chatMessage', {
		type: 'status',
		text: '已连接',
		created: Date.now(),
		username: socket.request.user.username,
        fullName: socket.request.user.fullName
	});
	
	socket.on('chatMessage', function(message) {
		message.type = 'message';
		message.created = Date.now();
		message.username = socket.request.user.username;
        message.fullName = socket.request.user.fullName;
		io.to('defaultRoom').emit('chatMessage', message);
	});
	
	socket.on('disconnect', function() {
		io.to('defaultRoom').emit('chatMessage', {
			type: 'status',
			text: '已断开连接',
			created: Date.now(),
			username: socket.request.user.username,
            fullName: socket.request.user.fullName
		});
	});
};