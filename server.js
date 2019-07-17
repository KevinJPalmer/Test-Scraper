//dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
//Set up port
var PORT = process.env.PORT || 3000;

//initiate express
var app = express();
//router
var router = express.Router();

//designate public folder
app.use(express.static(__dirname + "/public"));

//handlebars connection
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");


//bodyParser
app.use(bodyParser.urlencoded({
  extended: false
}));

//pass through router
app.use(router);

//
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to the db
mongoose.connect(db, { useNewUrlParser: true }, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("mongoose is connected");
  }
});
//listen to port
app.listen(PORT, function() {
  console.log("listening on port:" + PORT);
})
