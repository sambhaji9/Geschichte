$(document).ready(function() {
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
                console.log(httpRequest.responseText);
            }
        }
    };
    httpRequest.open("GET", "http://127.0.0.1:9000/create_file?appName=" + appDetails.appName + "&appVersion=" + appDetails.appVersion + "&fileNumber=" + appDetails.fileNumber, true);
    httpRequest.send();
}