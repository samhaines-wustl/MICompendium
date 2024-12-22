import data from './data.json' with {type: 'json'};

function main() {
    document.getElementById('searchBar').addEventListener('keyup', filterTable);
    document.getElementById('propDropdown').addEventListener('change', updateSearchBar);
    document.getElementById('sortButton').addEventListener('click', sortTable);
    document.getElementById('sortDirectionButton').addEventListener('click', switchSortDirection);

    populateDropdown();
    buildTable();
}

function buildTable() {
    let table = document.getElementById("compendium");

    //Build Header
    let thead = document.createElement("thead");
    let row = document.createElement('tr');
    for (let prop in data[0]) {
        if (Object.prototype.hasOwnProperty.call(data[0], prop)) {
            let cell = document.createElement('th');
            let cellText = document.createTextNode(prop);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
    }
    thead.appendChild(row);
    table.appendChild(thead);

    //Build Body
    let tbody = document.createElement('tbody');
    for (let i in data) {
        row = document.createElement('tr');
        for (let prop in data[i]) {
            if (Object.prototype.hasOwnProperty.call(data[i], prop)) {
                let cell = document.createElement('td');
                cell.innerHTML = data[i][prop];
                //let cellText = document.createTextNode(data[i][prop]);
                //cell.appendChild(cellText);
                row.appendChild(cell);
            }
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
}   

function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("compendium");
    tr = table.getElementsByTagName("tr");

    //Figure out what column to do
    let colIndex = getColumnIndex(document.getElementById('propDropdown').value);

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[colIndex];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
}

function populateDropdown() {
    let dropdown = document.getElementById('propDropdown');
    for (let prop in data[0]) {
        if (Object.prototype.hasOwnProperty.call(data[0], prop)) {
            let option = document.createElement('option');
            option.value = prop
            let optionText = document.createTextNode(prop);
            option.appendChild(optionText);
            dropdown.appendChild(option);
        }
    }
}

function updateSearchBar() {
    document.getElementById("searchBar").placeholder = "Search by " + document.getElementById('propDropdown').value
}

function getColumnIndex(val) {
    let index = 0;
    for (let prop in data[0]) {
        if (Object.prototype.hasOwnProperty.call(data[0], prop)) {
           if (prop == val) {
            break;
           }
           else {
            index++;
           }
        }
    }
    return index;
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("compendium");
    switching = true;

    //Figure out what column to do
    let colIndex = getColumnIndex(document.getElementById('propDropdown').value);
    console.log(colIndex);

    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[colIndex];
        y = rows[i + 1].getElementsByTagName("TD")[colIndex];
        //check if the two rows should switch place:
        if (document.getElementById('sortDirectionButton').textContent == '^') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        }
        if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        }
    }
}

function switchSortDirection() {
    let button = document.getElementById('sortDirectionButton');
    button.textContent == '^' ? button.textContent = 'v' : button.textContent = '^';
    sortTable();
}

main();