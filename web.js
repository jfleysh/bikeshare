var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/app.html', function(req, res) {
    res.sendfile('app.html');
});

app.get('/bikedetails.html', function(req, res) {
    res.sendfile('bikedetails.html');
});

app.use(express.static('public'));

var port = process.env.PORT || 3000;

app.listen(port);