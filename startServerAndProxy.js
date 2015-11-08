var httpProxy = require('http-proxy');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')

var app = express();


app.use(express.static('public'))

app.listen(2000, function() {
	console.log('Server running at localhost:2000');
});

var apiProxy = httpProxy.createProxyServer();
app.all("/api", function(req, res) {
  	apiProxy.web(req, res, { target: 'http://kulturarvsdata.se/ksamsok' });
});

//NOTE: Important that these two lines are after the proxy, the middleswares need to be in correct order
//otherwise it will cause the server to crash.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

function setup() {
}