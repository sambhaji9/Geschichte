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

    var status = false;
    var file = fileSys.writeFile("./public/stasi_files/" + request.query.fileNumber + ".json", "[]", function(err) {
        if (err) {
            console.error("Error in creating file");
        } else {
            // set the status as true
            status = true;
            console.log(request.query.appName + ", " + request.query.appVersion + ", " + request.query.fileNumber + " created successfully");

            // initialise an empty array
            var appsArray = [];
            // register the app in index.json
            appsArray = registerApp(request.query.appName, request.query.appVersion, request.query.fileNumber);
        }
    });
    // send the status of the operation
    response.send(status);
});

var server = app.listen(9000, function() {
    console.log("Server listening on 127.0.0.1:9000");
});

/**
 * function registering the app details in the index.json file
 * @param {string} appName 
 * @param {string} appVersion 
 * @param {number} fileNumber 
 */
function registerApp(appName, appVersion, fileNumber) {
    var fileRead = fileSys.readFile("./public/stasi_files/index.json", "utf-8", function(err, data) {
        if (err) {
            console.error(err);
        } else {
            // parse the data and get it in an array
            var indexArray = JSON.parse(data);

            // create a temporary object
            var tempObj = {};
            tempObj.appName = appName;
            tempObj.appVersion = appVersion;
            tempObj.fileNumber = fileNumber;

            indexArray.push(tempObj);

            // rewrite the index.json

            return indexArray;
        }
    });
}