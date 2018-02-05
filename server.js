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

            // register the app in index.json
            response.send(registerApp(request.query.appName, request.query.appVersion, request.query.fileNumber));
        }
    });
});

app.get("/get_apps_list", function(request, response) {
    // read the index.json file
    var array = fileSys.readFileSync("./public/stasi_files/index.json", "utf-8");
    // return array
    response.send(array);
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
    // Synchronously read the index.json file
    var fileRead = fileSys.readFileSync("./public/stasi_files/index.json", "utf-8");

    // parse the data and get it in an array
    indexArray = JSON.parse(fileRead);

    // create a temporary object
    var tempObj = {};
    tempObj.appName = appName;
    tempObj.appVersion = appVersion;
    tempObj.fileNumber = fileNumber;

    indexArray.push(tempObj);

    // rewrite the index.json
    var fileWrite = fileSys.writeFileSync("./public/stasi_files/index.json", JSON.stringify(indexArray, null, 4));

    // read and return the data file
    var data = JSON.parse(fileSys.readFileSync("./public/stasi_files/index.json", "utf-8"));
    return data;
}