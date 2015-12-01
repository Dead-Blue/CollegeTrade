process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./Config/mongoose');
var express = require('./Config/express');
var passport = require('./Config/passport');

var db = mongoose();
var app =express(db);
var passport = passport();
app.listen(8080);
module.exports = app;
console.log('Server running at http://localhost:8080/');