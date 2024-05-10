//creates an HTML element to display output

var output;
var solutionsExpressions;

function printOutput() {
    var jumbotronDiv = document.createElement("div");
    jumbotronDiv.setAttribute("class", "jumbotron")

    var para = document.createElement("p");
    var paragraphText = document.createTextNode("You Entered minterms: " + minTerms + " And don't cares: " + dontCares + " and number of inputs = " + numberOfInputs);
    para.appendChild(paragraphText);
    jumbotronDiv.append(para);
    if (!specialcase) {
        solutionsExpressions = generateSolutionsExpressions();
    }
    output = "";
    for (var i = 0; i < solutionsExpressions.length; i++) {
        var solutionParagraph = document.createElement("p");
        var solutionText = document.createTextNode("Solution " + (i + 1) + ": F = " + solutionsExpressions[i]);
        output = output.concat("Solution " + (i + 1) + ": F = " + solutionsExpressions[i] + "\n");
        solutionParagraph.appendChild(solutionText);
        jumbotronDiv.append(solutionParagraph);
    }

    var outputDiv = document.getElementById("output");

    //removes content of the output div in case the user enters another input without refreshing
    while (outputDiv.hasChildNodes()) {
        outputDiv.removeChild(outputDiv.lastChild);
    }

    outputDiv.appendChild(jumbotronDiv);
}

function createDownloadButton() {

    buttonDiv = document.getElementById("downloadButton");
    while (buttonDiv.hasChildNodes()) {
        buttonDiv.removeChild(buttonDiv.lastChild);
    }

    divCol6 = document.createElement("div");
    divCol6.setAttribute("class", "col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right");

    button = document.createElement("input");
    button.setAttribute("type", "submit");
    button.setAttribute("class", "btn btn-primary btn-lg");
    button.setAttribute("onClick", "download('output.txt', output);");
    button.setAttribute("value", "Download");

    divCol6.appendChild(button);
    buttonDiv.appendChild(divCol6)
}

function printSteps() {

    if (!specialcase) {
        generateGroupListsTables();
    }

    if (uncoveredMinTerms != undefined) {
        generateCoverTables();
    }

}

function clearSteps() {
    var groupingDiv = document.getElementById("grouping");
    var coverTablesDiv = document.getElementById("coverTables");

    //removes content of the output div in case the user enters another input without refreshing
    while (groupingDiv.hasChildNodes()) {
        groupingDiv.removeChild(groupingDiv.lastChild);
    }

    while (coverTablesDiv.hasChildNodes()) {
        coverTablesDiv.removeChild(coverTablesDiv.lastChild);
    }
}
//-------------------------------------Grouping Process Functions--------------------
/*
 * Creates tables out
 * of the group lists
 */
function generateGroupListsTables() {
    var divContainer = document.createElement("div");
    divContainer.setAttribute("class", "container-fluid")

    var jumbotronDiv = document.createElement("div");
    jumbotronDiv.setAttribute("class", "jumbotron");

    var header = document.createElement("h3");
    var headerText = document.createTextNode("Grouping Process");
    header.appendChild(headerText);

    for (var i = 0; i < groupLists.length; i++) {
        groupListTable = generateGroupListTable(groupLists[i], i);
        divContainer.appendChild(groupListTable);
    }

    var groupingDiv = document.getElementById("grouping");

    var primeImplicantsStringArr = [];
    for (var i = 0; i < primeImplicants.length; i++) {
        primeImplicantsStringArr.push(generateImplicantExpression(primeImplicants[i]));
    }
    var paragraph = document.createElement("p");
    var paragraphText = document.createTextNode("Prime Implicants Found: " + primeImplicantsStringArr.join(", "))
    paragraph.appendChild(paragraphText);

    //Add jumbotron containing all group list tables
    jumbotronDiv.appendChild(header);
    jumbotronDiv.appendChild(divContainer);
    jumbotronDiv.appendChild(paragraph);
    groupingDiv.appendChild(jumbotronDiv);
}

/*
 * Creates one table out
 * of a group list
 * returns a div containing the table
 */
function generateGroupListTable(groupList, index) {


    var divCol4 = document.createElement("div");
    divCol4.setAttribute("class", "col-xs-6 col-sm-6 col-md-3 col-lg-3");

    var divTableResponsive = document.createElement("div");
    divTableResponsive.setAttribute("class", "table-responsive");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var tr1 = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute("colspan", 2);
    th.setAttribute("class", "success");
    thText = document.createTextNode("Implicants of size " + Math.pow(2, index));
    th.appendChild(thText);

    tr1.appendChild(th);
    thead.appendChild(tr1);
    table.appendChild(thead);


    var tbody = generateGroupListTableBody(groupList);

    table.appendChild(tbody);
    divTableResponsive.appendChild(table);
    divCol4.appendChild(divTableResponsive);
    return divCol4;
}

/*
 * Creates table body and
 * populates it with data of the implicant
 * returns a populated table bodyl
 */
function generateGroupListTableBody(groupList) {
    var tbody = document.createElement("tbody");

    for (var i = 0; i < groupList.length; i++) {
        var group = groupList[i];

        for (var j = 0; j < group.members.length; j++) {
            imp = group.members[j];

            var tr = document.createElement("tr");
            if (j == 0) {
                tr.setAttribute("class", "top-bordered")
            }

            var td1 = document.createElement("td");
            td1Text = document.createTextNode(imp.mintermsCovered.join(", "));
            td1.appendChild(td1Text);

            var td2 = document.createElement("td");
            var symbol;
            if (imp.isChecked) {
                symbol = "✓";
            } else {
                symbol = "Prime";
            }

            if (imp.isDontCare) {
                symbol = symbol + " Dont care";
            }
            td2Text = document.createTextNode(symbol);
            td2.appendChild(td2Text);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }
    }
    return tbody;
}

//-------------------------------------Minterms Implicants tables functions--------------------

function generateCoverTables() {
    var coverTablesDiv = document.getElementById("coverTables");
    var jumbotronDiv = document.createElement("div");
    jumbotronDiv.setAttribute("class", "jumbotron");
    var divContainer = document.createElement("div");
    divContainer.setAttribute("class", "container");

    var h3 = document.createElement("h3");
    var h3Text = document.createTextNode("Implicants/Minterms tables: ");
    h3.appendChild(h3Text);
    jumbotronDiv.appendChild(h3);

    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row text-center");
    divRow.appendChild(generateCoverTable(primeImplicants, minTerms));
    divContainer.appendChild(divRow);

    if (uncoveredMinTerms.length > 0) {
        var h4 = document.createElement("h4");
        var h4Text = document.createTextNode("After Elimination: ");
        h4.appendChild(h4Text);
        divContainer.appendChild(h4);

        var divRow = document.createElement("div");
        divRow.setAttribute("class", "row text-center");
        divRow.appendChild(generateCoverTable(remainingImplicants, uncoveredMinTerms));
        divContainer.appendChild(divRow);
    }

    jumbotronDiv.appendChild(divContainer);
    coverTablesDiv.appendChild(jumbotronDiv);
}

function generateCoverTable(implicants, terms) {
    var divTableResponsive = document.createElement("div");
    divTableResponsive.setAttribute("class", "table-responsive");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered");

    var thead = document.createElement("thead");
    var tr1 = document.createElement("tr");
    tr1.setAttribute("class", "bottom-bordered");

    var th1 = document.createElement("th");
    th1.setAttribute("class", "success right-bordered");
    tr1.appendChild(th1);

    for (var i = 0; i < terms.length; i++) {
        var th = document.createElement("th");
        var thText = document.createTextNode(terms[i]);
        th.setAttribute("class", "bottom-bordered");
        th.appendChild(thText);
        tr1.appendChild(th);
    }
    thead.appendChild(tr1);

    var tbody = document.createElement("tbody");

    for (var i = 0; i < primeImplicants.length; i++) {
        var termsCovered = primeImplicants[i].mintermsCovered;

        var tr = document.createElement("tr");

        var th = document.createElement("th");

        var thText = document.createTextNode(generateImplicantExpression(primeImplicants[i]));
        th.setAttribute("class", "right-bordered");
        th.appendChild(thText);
        tr.appendChild(th);

        for (var j = 0; j < terms.length; j++) {
            var td = document.createElement("td");
            if (termsCovered.includes(terms[j])) {
                var tdText = document.createTextNode("X");
                td.appendChild(tdText);
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    divTableResponsive.appendChild(table);
    return divTableResponsive;
}
//-------------------------------------Implicants to literals functions--------------------

//takes an array of all the valid solutions
//returns an array of strings each an expression for a solution
function generateSolutionsExpressions() {
    solutionsExpressions = [];
    for (var i = 0; i < solutions.length; i++) {
        solutionsExpressions.push(generateSolutionExpression(solutions[i]))
    }
    return solutionsExpressions;
}

/*takes an array of implicants representing a valid solution
 *returns a string representing the expression of these implicants in literals
 */
function generateSolutionExpression(solution) {
    var expression = [];
    for (var i = 0; i < solution.length; i++) {
        expression.push(generateImplicantExpression(solution[i]))
    }
    return expression.join(" + ");
}

/*takes one implicant
 *and returns it in form of literals
 */
function generateImplicantExpression(imp) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charArr = [];
    var baseValue = imp.baseValue;
    var bitsCovered = imp.bitsCovered;

    for (var i = 0; i < numberOfInputs; i++) {
        charArr.push("0");
    }

    for (var i = 0; i < numberOfInputs; i++) {
        if (baseValue & 1 << i) {
            var flippedIndex = numberOfInputs - 1 - i;
            charArr[flippedIndex] = "1";
        }
    }

    for (var i = 0; i < bitsCovered.length; i++) {
        var index = Math.log2(bitsCovered[i]);
        var flippedIndex = numberOfInputs - 1 - index;
        charArr[flippedIndex] = "x";
    }

    for (var i = 0; i < charArr.length; i++) {
        if (charArr[i] == "0") {
            charArr[i] = alphabet[i].concat("'");
        } else if (charArr[i] == "1") {
            charArr[i] = alphabet[i];
        } else if (charArr[i] == "x") {
            charArr[i] = "";
        }
    }

    return charArr.join('');
}
