module.exports = {
	db: 'mongodb://localhost/collegeTrade',
	sessionSecret: 'developmentSessionSecret',
    redis:{
      RDS_PORT: 6379,        //端口号  
      RDS_HOST : 'localhost',    //服务器IP   
      RDS_OPTS : {},  //设置项
       }
};