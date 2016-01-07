var redis = require('redis');
var config =require('./config');
module.exports=function(){
            var redisClient = redis.createClient(config.redis.RDS_PORT,config.redis.RDS_HOST,config.redis.RDS_OPTS);
            return redisClient;
}