import data from './data.json' with {type: 'json'};

const TABLE_COLUMNS = ['name', 'owner', 'type', 'specific_type', 'description'];
const TABLE_COLUMNS_NAMES = ['Item', 'Owner', 'Type', "Specific Type", 'Description'];

function main() {
    document.getElementById('searchBar').addEventListener('keyup', filterTable);
    document.getElementById('propDropdown').addEventListener('change', updateSearchBar);
    document.getElementById('sortButton').addEventListener('click', sortTable);
    document.getElementById('sortDirectionButton').addEventListener('click', switchSortDirection);

    document.getElementById('toggleAttunement').addEventListener('click', filterTableUnicode);
    document.getElementById('toggleCraftable').addEventListener('click', filterTableUnicode);
    document.getElementById('toggleBroken').addEventListener('click', filterTableUnicode);
    document.getElementById('toggleCursed').addEventListener('click', filterTableUnicode);


    populateDropdown();
    updateSearchBar();
    buildTable();
}

function buildTable() {
    let table = document.getElementById("compendium");

    //Build Header
    let thead = document.createElement("thead");
    let row = document.createElement('tr');
    TABLE_COLUMNS_NAMES.forEach( prop => {
        let cell = document.createElement('th');
        let cellText = document.createTextNode(prop);
        cell.appendChild(cellText);
        row.appendChild(cell);
    }); 
    thead.appendChild(row);
    table.appendChild(thead);

    //Build Body
    let tbody = document.createElement('tbody');
    for (let i in data) {
        row = document.createElement('tr');
        TABLE_COLUMNS.forEach(prop => {
            let cell = document.createElement('td');
            let keyText = "";
            let hoverText = "";

            cell.innerHTML = data[i][prop];
            if (prop == 'name') {
                cell.classList.add('tooltip');
                if (data[i].new)
                    keyText += '<span class = "new_key keys">&#11088</span>';
                if (data[i].attunement)
                    keyText += '<span class = "attunement_key keys">&#9650</span>';
                if (data[i].status == 'Craftable')  
                    keyText += '<span class = "craftable_key keys">&#9874</span>';
                else if (data[i].status == 'Broken')
                    keyText += '<span class = "broken_key keys">&#129702</span>';
                if (data[i].curse != 'Safe')
                    keyText += '<span class = "curse_key keys">&#9909</span>';

                hoverText += '<span class = "tooltip_text">' + data[i].lore + '</span>';

                cell.innerHTML = '<span class = "item_name">' + data[i][prop] + '</span>';
            }
            cell.innerHTML = keyText + cell.innerHTML + hoverText;
            row.appendChild(cell);
        });
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
    var colIndex = TABLE_COLUMNS.indexOf(document.getElementById('propDropdown').value);

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[colIndex];
        if (td) {
            if (colIndex == 0)
                txtValue = getChildNode(td, "item_name").textContent;
            else
                txtValue = td.textContent || td.innerText;
            
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].classList.remove('search_box_hidden');
            } else {
                tr[i].classList.add('search_box_hidden');
            }
        }       
    }
}

function populateDropdown() {
    let dropdown = document.getElementById('propDropdown');
    for (let i in TABLE_COLUMNS) {

        let option = document.createElement('option');
        option.value = TABLE_COLUMNS[i]
        let optionText = document.createTextNode(TABLE_COLUMNS_NAMES[i]);
        option.appendChild(optionText);
        dropdown.appendChild(option);
    }
}

function updateSearchBar() {
    document.getElementById("searchBar").placeholder = "Search by " + document.getElementById('propDropdown').options[document.getElementById('propDropdown').selectedIndex].textContent;
}

function sortTable() {
    var table, rows, switching, i, x, xText, y, yText, shouldSwitch;
    table = document.getElementById("compendium");
    switching = true;

    //Figure out what column to do
    let colIndex = TABLE_COLUMNS.indexOf(document.getElementById('propDropdown').value);

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

        //Get text contents of x and y
        if (colIndex != 0) {
            xText = x.innerHTML.toLowerCase();
            yText = y.innerHTML.toLowerCase();
        }
        else {
            xText = getChildNode(x, "item_name").textContent.toLowerCase();
            yText = getChildNode(y, "item_name").textContent.toLowerCase();
        }

        //check if the two rows should switch place:
        if (document.getElementById('sortDirectionButton').textContent == '^') {
            if (xText > yText) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else {
            if (xText < yText) {
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

function getChildNode(parent, classesString) {
    for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].className == classesString) {
            return parent.childNodes[i]
            txtValue = parent.childNodes[i].textContent;
        }        
    }
}

function filterTableUnicode() {
    var table, tr, td, i ,classBlacklist, passedAll;
    table = document.getElementById("compendium");
    tr = table.getElementsByTagName("tr");

    classBlacklist = getBlacklistFilter();

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            passedAll = true;
            classBlacklist.forEach(className => {
                if (td.getElementsByClassName(className).length > 0) { //If it does contain class name
                    tr[i].classList.add('blacklist_hidden');
                    passedAll = false;
                }
            });
            if (passedAll) {
                tr[i].classList.remove('blacklist_hidden');
            }
        }       
    }
}

function getBlacklistFilter() {
    var result = [];
    if (document.getElementById('toggleAttunement').checked)
        result.push('attunement_key');
    if (document.getElementById('toggleCraftable').checked)
        result.push('craftable_key');
    if (document.getElementById('toggleBroken').checked)
        result.push('broken_key');
    if (document.getElementById('toggleCursed').checked)
        result.push('curse_key');
    return result;
}

main();