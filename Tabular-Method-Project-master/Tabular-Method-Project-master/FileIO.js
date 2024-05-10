var reader;

/**
 * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

/**
 * read text input
 */
function readText(filePath) {
    var output = "";
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            pareseInput(output);
        };
        reader.readAsText(filePath.files[0]);
    } else {
        return false;
    }
    return true;
}

/**
 * splits the lines of the text input
 */
function pareseInput(txt) {
    input = txt.split("\n");
    displayInput(input[0], input[1])
}

/**
 * sets the values of the text boxes
 * to the input from the file
 */
function displayInput(minterms, dontCares) {
    var mintermInput = document.getElementById('Minterms');
    var dontCareInput;
    if (input[1] != undefined) {
        dontCareInput = document.getElementById('DontCares');
    } else {
        dontCareInput = "";
    }
    mintermInput.value = minterms;
    dontCareInput.value = dontCares;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
