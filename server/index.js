const path = require("path");

let app = require('./app.js');

process.on('unhandledRejection', err => {
	console.error(new Date(), ' custom unhandledRejection', err);
	return;
});

let http = require('http');
http.createServer({}, app).listen(process.env.PORT, function () {
	console.log('Server started');
	console.log('PORT: ' + process.env.PORT || 3000);
	console.log('NODE_ENV: ', process.env.NODE_ENV || 'dev');
	console.log('—'.repeat(80));
});
