// load the express module
var express = require("express");
var app = express();

// use the static files from public folder
app.use(express.static("public"));

app.get("/index.html", function(request, response) {
    response.send(__dirname + "/index.html");
});

var server = app.listen(9000, function() {
    console.log("Server listening on 127.0.0.1:9000");
});