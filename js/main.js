'use strict';

function loadCSVFile(event) {
    var csvfile = event.target.files[0];

    if (csvfile) {
        var ta_original = document.getElementById("original");

        var ta_processed = document.getElementById("processed-values");
        var only_zeros = true;

        var reader = new FileReader();

        // fuction is called after a read operation activates the text areas. 
        reader.onloadstart = function () {
            ta_original.value = "";
            ta_processed.value = "";

            //this function is called when a read process completes successfully. It seperates the CSV Headings from the values and then processes them.
            reader.onload = function () {
                var lines = reader.result.split(reader.result.indexOf("\r") > 0 ? "\r\n" : "\n");

                var delim = lines[0].indexOf(",") == -1 ? " " : " ,";

                //Retrieve and set headers

                document.getElementById("header-text-div").innerHTML = lines[0];

                //creating a two-dimensional array (matrix) and store values.

                var matrixValues = new Array(lines.length    - 1);
                var bad_lines = [];

                for (var row = 1; row < lines.length; row++) {
                    var values = lines[row].split(delim);

                    matrixValues[row - 1] = new Array(values.length);
                    for (var col= 0; col<values.length; col++) {
                        matrixValues[row - 1][col] = parseInt(values[col]);
                        ta_original.value += values[col];
                        ta_original.value += col + 1 < values.length ? delim : "";

                        //At least, there should be a number different from zero 
                        if (only_zeros && matrixValues[row - 1][col] != 0) {
                            only_zeros = false;
                        }
                        ta_original.value += row + 1 < lines.length ? "\n" : "";

                        //This stores a bad line in index

                        if (matrixValues[row - 1].includes(0)) {
                            bad_lines.push(row - 1);
                        }
                    }

                    //Parse and process bad Values

                    while (bad_lines.length > 0 && !only_zeros) {
                        var bad_l = bad_lines[bad_lines.length - 1];

                        var verticalLength = matrixValues.length;

                        while (matrixValues[bad_l].includes(0)) {
                            var col = matrixValues[bad_l].indexOf(0); var good = 0;
                            var verticalLength = matrixValues[bad_l].length;
                            //search neighbours
                            for (var x = 1, y = 1; (x < verticalLength || y < verticalLength) && good == 0; x++, y++) {
                                if (col - x >= 0) {
                                    //west
                                    good = matrixValues[bad_l][col - x];
                                }
                                if (col + x < verticalLength && good == 0) {
                                    // east 
                                    good = matrixValues[bad_l]
                                    [col + x];
                                }
                                if (bad_l - y >= 0 && good == 0) {
                                    //north

                                    good = matrixValues[bad_l - y][col];
                                }
                                if (bad_l + y < verticalLength && good == 0) {
                                    //south
                                    good = matrixValues[bad_l + y][col];
                                }
                                if (good != 0) {
                                    matrixValues[bad_l][col] = good;
                                }
                                else {
                                    console.log("No Close Neighbors!   Using the Tesseract to find a further neighbor..");
                                }

                                while (matrixValues[bad_l][col] == 0) {
                                    var tx = Math.floor(Math.random() * matrix[0].length);

                                    var ty = Math.floor(Math.random() * matrixValues.length);

                                    matrix[bad_l][col] = matrixValues[ty][tx];
                                }


                            }

                        }
                        bad_lines.pop();
                    }
                    // Set the value of the second textarea

                    for (var my = 0; my < matrixValues.length; my++) {
                        for (var mx = 0; mx < matrixValues[my].length; mx++) 
                        {
                            ta_processed.value += matrixValues[my][mx];
                            ta_processed.value += mx + 1 < matrixValues[my].length ? delim : "";

                        }

                        ta_processed.value += my + 1 < matrixValues.length ? "\n" : "";
                    }
                }
                // Called after a read completes (either successfully or unsuccessfully)
                reader.onloadend = function () {
                    if (reader.error) {
                        alert("The file was not loaded successfully. Please try again.");
                        console.error("Unsuccessful load of " + csvfile.name + ": " + reader.error.message);
                    }
                    else {
                        // Get the textarea's value and create the html content of the text-div
                        // and style all "bad" values.
                        var html = ta_original.value.replace(/\n/g, "<br>").replace(/0/g, "<b>0</br>");

                        document.getElementById("text-control").innerHTML = html;

                        // and similar for the processed textarea
                        html = only_zeros ? "<br>&nbsp; ¯\\_(ツ)_/¯ <br><br>" : ta_proccessed.value.replace(/\n/g, "<br>");
                        document.getElementById("text-control").innerHTML = html;

                        // Show the elements
                        var hidden = document.getElementsByClassName("csv-file-info");
                        if (hidden.length > 0) {
                            hidden[0].className = "";
                        }

                    }

                }
                // Called when there is an error during the load

                reader.onerror = function (){
                    console.error("Erroe while loading" + csvfile.name + ": " + reader.error.message);
                }

            }
        }

        // Read from blob as a string and the result will be stored on this.result after the 'load' event fires
        reader.readAsText(csvfile);
    }
    else {
        alert("Oops! Something unexpected happened... Please try again.");
    }
}