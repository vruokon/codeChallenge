let object_for_table = [{
    'player': 'Player1',
    'score': 1540
},{
    'player': 'Player2',
    'score': 123
},{
    'player': 'Player3',
    'score': 981
},{
    'player': 'Player4',
    'score': 642
},{
    'player': 'Player5',
    'score': 3781
},];
let asc = false;

function Table(list_of_objects, id) {
    this.list_of_objects = list_of_objects;
    this.id = id;
    this.addBoxNotOpen = true;

    this.maketable = () => {
        //Creates an element table
        let theTable = document.createElement('table');
        //Goes through the first object of the list, and creates headings from object keys
        Object.keys(this.list_of_objects[0]).forEach((key) => {
            //Creates element <th>
            let heading = document.createElement('th');
            heading.id = 'heading_' + key.toLowerCase();
            heading.append(document.createTextNode(key.toUpperCase()));
            theTable.append(heading);
        });
        //Goes through the entire list,
        this.list_of_objects.forEach((o, index) => {
            let row = document.createElement('tr');
            row.id = index;
            let column;
            //and from the list goes through the object
            Object.keys(o).forEach((key) => {
                //Creates element <td>
                column = document.createElement('td');
                //if a column contains string text-align is left else it is right
                if (isNaN(o[key])) {
                    column.style.textAlign = 'left';
                } else {
                    column.style.textAlign = 'right';
                }
                //Creates a text node from object key value
                let node = document.createTextNode(o[key]);
                //appends that to the column
                column.append(node);
                //and that column appends to the row
                row.append(column);
            });
            //that row appends to the table
            theTable.append(row);
        });
        //if there is already table, erase that table
        if (document.getElementById(this.id).hasChildNodes()) {
            document.querySelector('table').remove();
        }
        //make new table
        document.getElementById(this.id).append(theTable);
    }

    //Sorts the table if asc == true, then it sorts from the lowest to highest score,
    //else sorts from the highest to lowest
    this.sortTableScore = () => {
        if (asc == false) {
            asc = true;
            this.list_of_objects.sort((a, b) => {
                return a.score - b.score;
            })
        } else {
            asc = false;
            this.list_of_objects.sort((a, b) => {
                return b.score - a.score;
            });
        }
        this.maketable();
    }
    //Sorts table by player name
    this.sortTableName = () => {
        if (asc == false) {
            asc = true;
            this.list_of_objects.sort((a, b) => {
                return a.player.localeCompare(b.player);
            })
        } else {
            asc = false;
            this.list_of_objects.sort((a, b) => {
                return b.player.localeCompare(a.player);
            });
        }
        this.maketable();
    }

    //Starts eventlistener
    this.listener = () => {
        document.getElementById(id).addEventListener('click', (event) => {
            if(event.target.tagName == 'TD'){
                    this.openAddpointsBox(event.target.parentElement.id);
            }
            let sort_by = event.target.textContent.toLowerCase();
            if(sort_by == 'score') {
                this.sortTableScore();
            } else if (sort_by == 'player') {
                this.sortTableName();
            }
           });
    }
    //Checks if player name is in the list, and if is returns that players index number
    this.inList = (playerName) =>{
        for(let i = 0; i<this.list_of_objects.length; i++) {
            if(this.list_of_objects[i].player == playerName) {
                return i;
            }
        } 
        return -1;
    }
    //Opens a new row for point input to a player
    this.openAddpointsBox = (index_number) => {
        //If there is already one point input onpen, this won't let open another 
        if(document.getElementById('pointInput')){
            return;
        }
        //Takes the row what was clicked by index_number
        let element = document.getElementById(index_number);
        //Creates new table row
        let newElement = document.createElement('tr');
        newElement.className = 'inputCard';
        newElement.id = 'pointInput';

        //Adds that new table row behind that row that was clicked
        element.parentNode.insertBefore(newElement, element.nextSibling);
        //Creates new table cell where we insert a textnode
        let newTd = document.createElement('td');
        newTd.appendChild(document.createTextNode('Insert points for player: '));
        //Adds that new table cell to the new row element
        newElement.appendChild(newTd);

        //Creates new table cell for the input and button
        let newTd_for_button_and_input = document.createElement('td');
        newTd_for_button_and_input.style.textAlign = 'right';
        //Creates an input
        let input = document.createElement('input');
        input.id = 'scoresToAdd';
        newTd_for_button_and_input.appendChild(input);
        //Creates a button
        let button = document.createElement('button');
        button.appendChild(document.createTextNode('Add points'));
        newTd_for_button_and_input.appendChild(button);
        //Adds the input and button to the row element
        newElement.appendChild(newTd_for_button_and_input);

        //If button is clicked
        button.onclick = () => {
            //Take the value from the input and check if that value is valid
            let where_to_add = this.inList(document.getElementById(index_number).childNodes[0].textContent);
            let what_to_add = parseInt(document.getElementById('scoresToAdd').value);
            if (isNaN(what_to_add)) { document.getElementById('errorMessage').innerText =  'Input value was not a number'; return}
            if(what_to_add < 1) { document.getElementById('errorMessage').innerText = 'Input value was too low'; return}

            //If input value was valid, add that to existing score
            object_for_table[where_to_add].score += what_to_add;
            document.getElementById('pointInput').remove();
            
            //Erase error message 
            document.getElementById('errorMessage').innerHTML = '<br>';
            //And update table
            this.maketable();
        };
    }
}

//Starts when add player button is pressed
let submit = () => {
    //Take values from the inputs and validate those
    let player = document.getElementById('player').value;
    if(!isNaN(player)){ document.getElementById('errorMessage').innerText = 'Player name can\'t be empty or a number'; return}
    let score = parseInt(document.getElementById('score').value);
    if(isNaN(score)) {document.getElementById('errorMessage').innerText = 'Score have to be at least 0'; return}
    let listIndex = table.inList(player);

    //If player is not already in the table insert player to the table
    if(listIndex<0) {
        object_for_table.push({
            "player": player,
            "score": score
        });
    } else {
        document.getElementById('errorMessage').innerText = 'There is already player ' + player + ' in the table';
        return;
    }
    document.getElementById('errorMessage').innerHTML = '<br>';
    table.maketable();
}

let table = new Table(object_for_table, 'scoreBoard');
table.maketable();
table.listener();
