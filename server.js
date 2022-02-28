const fs = require('fs');
const express = require('express');
const https = require('https')
const app = express();
const path = require('path');

// set up plain http server
var http = express();

// viewed at http://localhost:8080
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/config', express.static(__dirname + '/config'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/index.html'));
});
app.get('/volunteer-register', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/volunteer-register.html'));
});
app.get('/record', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/record.html'));
});
app.get('/record-test', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/recordTest.html'));
});
app.get('/complete', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/complete.html'));
});
app.get('/start', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/start.html'));
});
app.get('/policy', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/policy.html'));
});
app.get('/term-condition', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/term-condition.html'));
});
app.get('/terms-condition-modal', function(req, res) {
    res.sendFile(path.join(__dirname + '/page/terms.html'));
});

app.listen(8082);