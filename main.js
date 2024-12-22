import data from './data.json' with {type: 'json'};

function main() {
    document.getElementById('searchBar').addEventListener('keyup', filterTable);

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

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
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

main();