var config = require('../../Config/config');
var MongoClient = require('mongodb').MongoClient
exports.render = function(req,res) {
	res.render('index', {
		title: 'Hello',
		user: JSON.stringify(req.user)
	});
};
exports.test = function(req,res) {
	res.render('Test/test', {
	});
};
exports.recentVisitNumber = function(req,res){
     MongoClient.connect(config.db,function(err,db){
        if(err) { return console.dir(err); }
        var visits=0;
        var sessions = db.collection('sessions');
          sessions.count(function(err,sessions){
        if(err){
            return res.status(500).send({
                success:false,
                message:'服务器错误'
            });
        }
        visits=sessions;
        db.close();
        return res.send({
            success:true,
            recentVisitNumber:visits
        });
    })
    })
   
}