$(document).ready(function() {

    // load the apps list in the beginning
    getAppsList();

    $("#btnSaveApp").on("click", function() {
        // Declare and initialize appDetails object
        var appDetails = {};
        appDetails.appName = document.getElementById("inputAppName").value;
        appDetails.appVersion = document.getElementById("inputAppVersion").value;
        appDetails.fileNumber = Date.now();

        if (appDetails.appName !== "" && appDetails.appVersion !== "") {
            // write the file here
            createFile(appDetails);
            // hide the modal
            $("#addNewAppModal").modal("hide");
        }
    });

    $("#save").on("click", function() {

    });
});

/**
 * function creating the file and loading the apps list again
 * @param {object} appDetails 
 */
function createFile(appDetails) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Cannot create XMLHttpRequest");
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                // reload the apps list here
                loadList(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/create_file?appName=" + appDetails.appName + "&appVersion=" + appDetails.appVersion + "&fileNumber=" + appDetails.fileNumber, true);
    httpRequest.send();
}

/**
 * function reloading the apps list in the left pane
 * @param {array} appsList 
 */
function loadList(appsList) {
    // get the reference to left pane
    var leftPane = document.getElementById("leftPane");
    // empty left pane
    emptyPane(leftPane);

    // get the count of apps
    var mLength = appsList.length;

    // iterate over the apps list
    for (var app = 0; app < mLength; app++) {
        var para = document.createElement("p");
        // set the id attribute
        para.setAttribute("id", appsList[app].fileNumber);
        // set innerHTML
        para.innerHTML = appsList[app].appName;
        //append appName to left pane
        leftPane.appendChild(para);
    }
}

/**
 * function removing the child nodes of left pane
 */
function emptyPane(pane) {
    // iterate and remove the child nodes
    while (pane.firstChild) {
        pane.removeChild(pane.firstChild);
    }
}

/**
 * function returning the appsList
 * @returns {array} list of apps
 */
function getAppsList() {
    var appsArray = [];

    // AJAX call to get the apps List
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert("Cannot create XMLHttpRequest");
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                loadList(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/get_apps_list", true);
    httpRequest.send();
}