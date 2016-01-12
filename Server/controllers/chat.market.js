module.exports = function(nsp, socket) {
    socket.join('defaultRoom');
    var clientlist
    nsp.in('defaultRoom').clients(function(error, clients){
  if (error) throw error;
  clientlist=clients;
  nsp.to('defaultRoom').emit('newMember', {
		type: 'status',
		text: '已连接',
		created: Date.now(),
        socketId: socket.id,
        clientlist:clientlist,
		username: socket.request.user.username,
        fullName: socket.request.user.fullName,
	});
});
	
	socket.on('sayToSomeone', function(msg){
        msg.type = 'message';
		msg.created = Date.now();
		msg.username = socket.request.user.username;
        msg.fullName = socket.request.user.fullName;
        msg.socketId = socket.id;
        msg.userId = socket.request.user._id
    socket.broadcast.to(msg.targetSocketId).emit('privateMessage', msg);
    });
	socket.on('chatMessage', function(message) {
		message.type = 'message';
		message.created = Date.now();
		message.username = socket.request.user.username;
        message.fullName = socket.request.user.fullName;
        message.socketId = socket.id;
        message.userId = socket.request.user._id
		nsp.to('defaultRoom').emit('chatMessage', message);
	});
	
	socket.on('disconnect', function() {
        nsp.in('defaultRoom').clients(function(error, clients){
  if (error) throw error;
  clientlist=clients;
  nsp.to('defaultRoom').emit('leaveMember', {
			type: 'status',
			text: '已断开连接',
			created: Date.now(),
            socketId: socket.id,
            clientlist:clientlist,
			username: socket.request.user.username,
            fullName: socket.request.user.fullName,
		});  
});
		  
	});
};