let view = {
    displayMessage: function (message) {
        let messageArea = document.getElementById('messageArea')
        messageArea.innerText = message

    },

    displayHit: function (location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'hit')
    },

    displayMiss: function (location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'miss')
    }
}

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: ['0', '0', '0'], hits: ['', '', ''] },
            { locations: ['0', '0', '0'], hits: ['', '', ''] },
            { locations: ['0', '0', '0'], hits: ['', '', ''] }],

    fire: function (guess) {
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage('Всего-то одно попадание')
                if (this.isSunk(ship)){
                    view.displayMessage('Ты потопил мой корабль, сука!')
                    this.shipsSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage('Ха-ха, как обычно, промах')
        return false
    },

    isSunk: function (ships) {
            for (let i = 0; i < this.shipLength; i++) {
                if (ships.hits[i] !== 'hit') {
                    return false
                }
            }
        return true
    },

    generateShipLocations: function () {
        let locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2)
        let row, col

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else {
            col = Math.floor(Math.random() * this.boardSize)
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        }

        let newShipLocations = []
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i))
            } else {
                newShipLocations.push((row + i) + '' + col)
            }
        }
        return newShipLocations
    },

    collision: function(locations) {
        for (let i = 0; i <  this.numShips; i++) {
            let ship = model.ships[i]
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

let controller = {
    guesses: 0,
    
    processGuess: function(guess) {
        let location = parseGuess(guess)
        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipsSunk === numShips) {
                view.displayMessage('Ладно, в этот раз ты победил, но такого больше не повторится')
                
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

    if (guess === null || guess.length !== 2) {
        alert('Увы, но ты, видимо, промахнулся по клавишам')
    } else {
        firstChar = guess.charAt(0)
        let row = alphabet.indexOf(firstChar)
        let column = guess.charAt(1)

        if(isNaN(row) || isNaN(column)) {
            alert('Увы, но твой прицел косит')
        } 
        else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert('Увы, но твой прицел косит')
        }
        else {
            return row + column
        }
    }
    return null
}

function init() {
    let fireButton = document.getElementById('fireButton')
    fireButton.onclick = handleFireButton
    let guessInput = document.getElementById('guessInput')
    guessInput.onkeypress = handleKeyPress

    model.generateShipLocations()
}

window.onload = init

function handleFireButton() {
    let guessInput = document.getElementById('guessInput')
    let guess = guessInput.value
    controller.processGuess(guess)

    guessInput.value = ''
}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton')
    if (e.keyCode === 13) {
        fireButton.click()
        return false
    }
}

