// load the express module
var express = require("express");
var app = express();
var bodyParser = require("body-parser");


// load the file system module
var fileSys = require("fs");

// use the static files from public folder
app.use(express.static("public"));

app.get("/index.html", function(request, response) {
    response.send(__dirname + "/index.html");
});

app.get("/create_file", function(request, response) {

    var file = fileSys.writeFile("./public/stasi_files/" + request.query.fileNumber + ".json", "[]", function(err) {
        if (err) {
            console.error("Error in creating file");
        } else {
            console.log(request.query.appName + ", " + request.query.appVersion + ", " + request.query.fileNumber + " created successfully");
        }
    });

    response.send(request.query.appName + ", " + request.query.appVersion + ", " + request.query.fileNumber);
});

var server = app.listen(9000, function() {
    console.log("Server listening on 127.0.0.1:9000");
});