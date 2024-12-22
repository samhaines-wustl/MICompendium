import data from './data.json' with {type: 'json'};

function main() {
    document.getElementById('searchBar').addEventListener('keyup', filterTable);
    document.getElementById('propDropdown').addEventListener('change', updateSearchBar);

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
    let filterIndex = document.getElementById('propDropdown').value;
    let filterCol = 0;
    for (let prop in data[0]) {
        if (Object.prototype.hasOwnProperty.call(data[0], prop)) {
           if (prop == filterIndex) {
            break;
           }
           else {
            filterCol++;
           }
        }
    }

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[filterCol];
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

main();