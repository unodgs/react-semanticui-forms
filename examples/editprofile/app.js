var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

function pause(millis) {
	var date = new Date();
	var curDate = null;
	do {
		curDate = new Date();
	}
	while (curDate - date < millis);
}

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/account/personal', function (req, res) {
	pause(3000);
	res.json({
		firstName: "Daniel",
		lastName: "Kos",
		email: "daniel.kos@test.com",
		userName: "unodgs",
		password: "topsecret"
	});
});

app.post('/api/account/personal', function (req, res) {
	pause(3000);
	res.status(401);
	res.end('');
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.end(err.message);
});

module.exports = app;
