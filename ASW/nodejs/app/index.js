var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./src/models/userModel');
var Category = require('./src/models/categoryModel');
var Level = require('./src/models/levelModel');
var Comment = require('./src/models/commentModel');
var Report = require('./src/models/reportModel');
var Highlighting = require('./src/models/highlightingModel');
var path = require("path");
global.appRoot = path.resolve(__dirname);

//Creo istanza di express (web server)
var app = express();

//importo parser per leggere i parametri passati in POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

// aspetto che il container di mongo sia su
function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

console.log('Taking a break...');
pausecomp(10000);
console.log('Ten seconds later, ...');

//connessione al db
mongoose.set('useFindAndModify', false);
mongoose.set('connectTimeoutMS', 30);
mongoose
    .connect('mongodb://mongodb:27017/dbapp', {
//    .connect('mongodb://127.0.0.1:27017/dbapp', {
             useNewUrlParser: true,
             useCreateIndex: true
           })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

var routes = require('./src/routes/routes');
routes(app);

//metto in ascolto il web server
app.listen(3000, function () {
    console.log('Node API server started on port 3000!');
});
