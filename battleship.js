//move  collision to game class
function Game() {
	this.boardSize= 8;
	this.numShips= 4;
	this.shipLengths= [2,3,3,4] ;
	this.shipsSunk = 0;
	this.ships = [];
        //store already missed locations so user can be notified if they already missesd tht location
        this.misses = [];
               
        this.flee = function(ship){
            //decides whether or not to move and in which direction
            var movechnce = Math.floor(Math.random()*2)
            var moveDirection = Math.floor(Math.random()*2)
            //check whether the ship can move
            if (ship.hit === true && ship.hitCount < 2 && movechnce===1){
                
                if(this.fleeCollision(this.positiveShift(ship.locations, ship.direction),ship)===false && moveDirection === 0){
                    //clear the old hits of the ship
                    for(var i = 0; i < ship.locations.length; i++){
                        this.displayBlank(ship.locations[i])
                    };
                    
                    ship.locations = this.positiveShift(ship.locations, ship.direction)
                    //display new hits and clear any misses at new locatioons
                    for(var i = 0; i < ship.locations.length; i++){
                        if(ship.hits[i]=== "hit"){ //transfer hits to new locations
                            this.displayHit(ship.locations[i])
                        }else{ //remove misses at new locations
                            if(this.misses.indexOf(ship.locations[i]) >= 0){
                                this.displayBlank(ship.locations[i])
                                this.misses.splice(this.misses.indexOf(ship.locations[i]), 1);
                            }
                        }
                        
                    };
                    //repeat for if negative shift occurs
                }else if(this.fleeCollision(this.negativeShift(ship.locations, ship.direction), ship)===false){
                    
                    for(var i = 0; i < ship.locations.length; i++){
                        this.displayBlank(ship.locations[i])
                    };
                    ship.locations = this.negativeShift(ship.locations, ship.direction)
                    for(var i = 0; i < ship.locations.length; i++){
                        if(ship.hits[i]=== "hit"){ //transfer hits to new locations
                            this.displayHit(ship.locations[i])
                        }else{ //remove misses at new locations
                            if(this.misses.indexOf(ship.locations[i]) >= 0){
                                this.displayBlank(ship.locations[i])
                                this.misses.splice(this.misses.indexOf(ship.locations[i]), 1);
                            }
                        }
                        
                    };
                    //if negative shift is chosen but fails than try postive shift
                }else if(this.fleeCollision(this.positiveShift(ship.locations, ship.direction), ship)===false){
                    for(var i = 0; i < ship.locations.length; i++){
                        this.displayBlank(ship.locations[i])
                    };
                    ship.locations = this.positiveShift(ship.locations, ship.direction)
                    for(var i = 0; i < ship.locations.length; i++){
                        if(ship.hits[i]=== "hit"){ //transfer hits to new locations
                            this.displayHit(ship.locations[i])
                        }else{ //remove misses at new locations
                            if(this.misses.indexOf(ship.locations[i]) >= 0){
                                this.displayBlank(ship.locations[i])
                                this.misses.splice(this.misses.indexOf(ship.locations[i]), 1);
                            }
                        }
                        
                    };
                
                }
            }
        }
        this.positiveShift = function(locations, direction){
           //based on direction ship is facing decide which location character to increase 
           var newLocations = [];
           for (var location = 0; location < locations.length; location++){
               newLocations.push(locations[location]);
               if(direction ===1){
                   newLocations[location]= newLocations[location].charAt(0) + "" + (parseInt(newLocations[location].charAt(1))+1)
               }else{
                   newLocations[location]= (parseInt(newLocations[location])+10).toString(); ;
               }
           }
           return newLocations;
        }
        this.negativeShift = function(locations, direction){
           //based on direction ship is facing decide which location character to decrease  
           var newLocations = [];
           for (var location = 0; location < locations.length; location++){
               newLocations.push(locations[location]);
               if(direction ===1){
                   newLocations[location]= newLocations[location].charAt(0) + "" + (parseInt(newLocations[location].charAt(1))-1);
               }else{
                   newLocations[location]= (parseInt(newLocations[location].charAt(0))-1) + "" + newLocations[location].charAt(1)
               }
           }
           return newLocations;
        }
        this.fleeCollision = function(locations,ship) {
                //check collisions with other ships but dont check with itself
                var index = this.ships.indexOf(ship);

		for (var i = 0; i < this.ships.length; i++) {
                    if(i !== index){
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
                    }
                }
                //checks ship is on the board
                for (var a = 0; a < locations.length; a++){
                    var firstChar = locations[a][0]
                    var secondChar = locations[a][1]
                    if (locations[a].indexOf("-") >= 0 || firstChar > (this.boardSize -1) || secondChar > (this.boardSize -1)){
                        return true;
                    }
                }
		return false;
	}
        this.fleeCall = function(){
            //calls flee function on every ship
            for(var ship = 0; ship < this.numShips; ship++){
                this.flee(this.ships[ship]);
            }
        }

	this.fire = function(guess) {//added flee call after every move and miss checker
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit" && index>=0) {
				this.displayMessage("Oops, you already hit that location!");
                                this.fleeCall();
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				this.displayHit(guess);
				this.displayMessage("HIT!");
                                ship.hit = true;
                                ship.hitCount++;
				if (this.isSunk(ship)) {
					this.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
                                this.fleeCall();
				return true;
			}
		}
                if(this.misses.indexOf(guess)>=0){
                    //check misses array if the location has already been missed
                    this.displayMessage("Oops, you already missed at that location");
                    this.fleeCall();
                    return false;
                }
                this.misses.push(guess);                
		this.displayMiss(guess);
		this.displayMessage("You missed.");
                this.fleeCall();
		return false;
	},

	this.isSunk = function(ship) {
		for (var i = 0; i < ship.length; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

        /*
         * Creates 'ship' objects
         */
	this.generateShipLocations = function() {
		// Create ships here.
                for(var ship = 0; ship<this.numShips; ship++){
                    this.ships[ship] = new Ship(this.shipLengths[ship]);
                };
	};
        
        this.displayMessage = function(msg) {
                var messageArea = document.getElementById("messageArea");
                messageArea.innerHTML = msg;
        }

        this.displayHit = function(location) {
                var cell = document.getElementById(location);
                cell.setAttribute("class", "hit");
        }

        this.displayMiss = function(location) {
                var cell = document.getElementById(location);
                cell.setAttribute("class", "miss");
        }
        this.displayBlank = function(location) {
                var cell = document.getElementById(location);
                cell.setAttribute("class", "empty");
        }

        
        
        this.guesses = 0,

        this.processGuess = function(guess) {
                var location = this.parseGuess(guess);
                if (location) {
                        this.guesses++;
                        var hit = myGame.fire(location);
                        if (hit && myGame.shipsSunk === myGame.numShips) {
                                        this.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
                        }
                }
        }
        
        // helper function to parse a guess from the user

        this.parseGuess = function(guess) {
                var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];

                if (guess === null || guess.length !== 2) {
                        alert("Oops, please enter a letter and a number on the board.");
                } else {
                        var firstChar = guess.charAt(0);
                        var row = alphabet.indexOf(firstChar);
                        var column = guess.charAt(1);

                        if (isNaN(row) || isNaN(column)) {
                                alert("Oops, that isn't on the board.");
                        } else if (row < 0 || row >= myGame.boardSize ||
                                   column < 0 || column >= myGame.boardSize) {
                                alert("Oops, that's off the board!");
                        } else {
                                return row + column;
                        }
                }
                return null;
        }

};




function Ship(length){
    this.locations = [];
    this.length = length;
    this.hits = ["","","",""];
    this.hit = false;
    this.hitCount = 0;
    this.direction;
    /*
         * Returns an array of ship locations.  The array should be the length
         * of the ship.
         * 
         * Ex. [14, 24, 34] for a ship of length 3
         */
        
    this.generateLocation = function(){
        var direction = Math.floor(Math.random() * 2);
	var row, col;

	if (direction === 1) { // horizontal
		row = Math.floor(Math.random() * myGame.boardSize);
		col = Math.floor(Math.random() * (myGame.boardSize - this.length + 1));
	} else { // vertical
		row = Math.floor(Math.random() * (myGame.boardSize - this.length + 1));
		col = Math.floor(Math.random() * myGame.boardSize);
	}

        var newShipLocations = [];
	for (var i = 0; i < this.length; i++) {
		if (direction === 1) {
			newShipLocations.push(row + "" + (col + i));
		} else {
			newShipLocations.push((row + i) + "" + col);
		}
	}
        this.direction = direction;
	return newShipLocations;

    }
    
    /*
 * Returns true if there is a collision between the ships, false otherwise
 * Accepts the array 'location' of a ship, and checks the existing ships in "ships"
 * for collisions.
 */

    this.collision = function(locations) {
		for (var i = 0; i < myGame.ships.length; i++) {
			var ship = myGame.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
    this.locations = this.generateLocation();    
    for (var i = 0; i < myGame.ships.length; i++) {
		while (this.collision(this.locations)){
                        this.locations = this.generateLocation();
            };	
	}
    console.log(this.locations);    
              
}
//Creates new Game
var myGame = new Game();

//event handlers

function handleFireButton(){
        var guessInput = document.getElementById("guessInput");
        var guess = guessInput.value.toUpperCase();

        myGame.processGuess(guess);

        guessInput.value = "";
}

function handleKeyPress(e) {
        var fireButton = document.getElementById("fireButton");

        // in IE9 and earlier, the event object doesn't get passed
        // to the event handler correctly, so we use window.event instead.
        e = e || window.event;

        if (e.keyCode === 13) {
                fireButton.click();
                return false;
        }
}


// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
        
	myGame.generateShipLocations();
        console.log(myGame.ships);
}
