var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    bodyParser = require('body-parser');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Connect to our mongo database
mongoose.connect('mongodb://feedcontrol:feedcontrol@jello.modulusmongo.net:27017/ixEve3je');
//mongoose.connect('mongodb://localhost:27017/feeds');


app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Index Route
app.get('/feed', routes.feeds);

// Page Route
app.post('/feed', routes.add_feed);




app.listen(port, function() {
    console.log('Server started: http://localhost:' + port + '/');
});