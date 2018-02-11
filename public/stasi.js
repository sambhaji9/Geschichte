$(document).ready(function() {

    // load the apps list in the beginning
    getAppsList();

    $("#btnSaveApp").on("click", () => {
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
        // initialize a event object
        var event = {};
        // get the inputText
        event.text = getInputText();
        // get the timeStamp
        var d = Date.now();
        event.dateStamp = new Date(d).toString();

        if (event.text !== "") {
            // save the event
            saveEvent(getInputText(), new Date(d).toString(), selectedApp.fileNumber);
        } else {
            alert("Enter some event, click on Save button");
        }
    });

    $("#leftPane").on("click", ".app-text", function() {

        // get the details of the selected app in left pane
        selectedApp = getAppDetails($(this).closest("p").attr("id"));
        // display the app name and app version
        showAppDetails(selectedApp);

        // show the inputText and saveButton
        $("#inputText").removeAttr("disabled");
        $("#save").removeAttr("disabled");

        // get the file data and show it in the middle pane as list
        getAppEventsList(selectedApp.fileNumber);
    });

    $("#inputText").on("keydown", function() {
        //document.getElementById("typewriter").play();
    });
});

/** 
 * array to save the apps details. A local copy of apps details for fast loading
 */
var appsList = [];

/**
 * variable for selected app object in the left pane
 */
var selectedApp = {};

/**
 * function saving and returning the events list for an app
 * @param {String} event text
 * @param {number} event date stamp
 * @param {number} fileNumber 
 * @returns {array} array of events list
 */
function saveEvent(eventText, eventDateStamp, fileNumber) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Cannot create an XMLHttpRequest");
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (JSON.parse(httpRequest.responseText))
                    getAppEventsList(fileNumber);
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/save_event?eventText=" + eventText + "&eventDateStamp=" + eventDateStamp + "&fileNumber=" + fileNumber, true);
    httpRequest.send();
}

/**
 * function returning the events list for an app
 * @param {number} fileNumber 
 * @returns {array} array of events list
 */
function getAppEventsList(fileNumber) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Cannot create an XMLHttpRequest");
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                showAppEventsList(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/get_events_list?fileNumber=" + fileNumber, true);
    httpRequest.send();
}

/**
 * function loading the events list for an app
 * @param {array} eventArray, list of events for an app  
 */
function showAppEventsList(eventArray) {
    // get referemce to middlePane
    var middlePane = document.getElementById("middlePane");
    // reset the middle pane
    emptyPane(middlePane);

    // create event table
    var eveTable = document.createElement("table");
    eveTable.setAttribute("class", "table table-striped table-bordered");

    // get the events count
    var eventCount = eventArray.length;

    // iterate over the events
    for (var event = eventCount - 1, num = 1; event >= 0; event--, num++) {
        // create row
        var eveRow = document.createElement("tr");

        // create serial number cell
        var serialNumCell = document.createElement("td");
        // set the cell width
        serialNumCell.style.width = "5%";
        serialNumCell.innerHTML = num;
        // align serial number to center
        serialNumCell.style.textAlign = "center";

        // create dateStamp cell and show dateStamp
        var dateCell = document.createElement("td");
        // set the cell width
        dateCell.style.width = "25%";
        dateCell.innerHTML = eventArray[event].eventDateStamp;

        // create eventText cell and show event
        var eventTextCell = document.createElement("td");
        // set the cell width
        eventTextCell.style.width = "75%";
        eventTextCell.innerHTML = eventArray[event].eventText;

        // append table cell to row
        eveRow.appendChild(serialNumCell);
        eveRow.appendChild(dateCell);
        eveRow.appendChild(eventTextCell);
        // append row to table
        eveTable.appendChild(eveRow);
    }

    // append table to middlePane
    middlePane.appendChild(eveTable);
    $("middlePane").fadeOut();
}

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

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                // reload the apps list here
                appsList = JSON.parse(httpRequest.responseText);
                console.log(JSON.stringify(appsList, null, 4));
                // load the appsList in leftPane
                loadList(appsList);
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
        para.setAttribute("class", "app-text");
        // set the id attribute
        para.setAttribute("id", appsList[app].fileNumber);
        // set innerHTML
        para.innerHTML = appsList[app].appName.concat(", ").concat(appsList[app].appVersion);
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

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                // reload the apps list here
                appsList = JSON.parse(httpRequest.responseText);
                // load the appsList in leftPane
                loadList(appsList);
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/get_apps_list", true);
    httpRequest.send();
}

/**
 * function returning the app details
 * @param {fileNumber} fileNumber
 * @returns {object} the app details
 */
function getAppDetails(fileNumber) {
    var selectedAppObj = {};
    var appsCount = appsList.length;
    // iterate over the appsDetails and return the id
    for (var app = 0; app < appsCount; app++) {
        var appObj = appsList[app];
        if (appObj.fileNumber === fileNumber) {
            selectedAppObj = appObj;
            break;
        }
    }

    return selectedAppObj;
}

/**
 * Show the header and sub header of the selected App
 * @param {number} selectedApp 
 */
function showAppDetails(selectedAppObj) {
    // display the header
    document.getElementById("header").innerHTML = selectedAppObj.appName;
    // display the subheader
    document.getElementById("subHeader").innerHTML = "Version: ".concat(selectedAppObj.appVersion);
}

/** 
 * function returning the input text
 * @returns {string} the input text
 */
function getInputText() {
    return document.getElementById("inputText").value;
}