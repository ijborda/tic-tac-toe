// Use strict
"use strict";

/**
 * OBJECT
 */

// Create tic-tac-toe object
class Game {
    
    constructor(p1wins, p2wins, ties) {
        // Current p1 score
        this.p1wins = p1wins
        // Current p2 score
        this.p2wins = p2wins
        // Current ties
        this.ties = ties
        // P1 is first turn
        this.turn = 1
        // Board is not filled on start (0 = not filled, 1 = filled by p1, 2 = filled by p2)
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        // No winner on start (Tie, Player 1, or Player 2)
        this.winner = undefined
        // No winning position on start
        this.winPosition = undefined
        // Players can play on start
        this.isFreeze = false
    }

    placeMove(move) {
        // Get coordinates of the filled box
        let col = +move.id[1]
        let row = +move.id[2]
        // Update this.moves
        this.moves[col][row] = this.turn
    }

    isValidMove(move) {
        // Get coordinates of the filled box
        let col = +move.id[1]
        let row = +move.id[2]
        if (this.isFreeze) {
            // Disallow the move if players can't play
            return false
        } else if (this.moves[col][row] === 0) {
            // Move is valid if box is not yet filled
            return true
        } else {
            // On other cases, move is not valid
            return false
        }
    }

    changeTurn() {
        // Change turn
        this.turn = this.turn === 1 ? 2 : 1
    }

    isGameEnd() {
        let winPositions = [[1, 0, 0, 1, 0, 0, 1, 0, 0],
                            [0, 0, 1, 0, 0, 1, 0, 0, 1],
                            [0, 1, 0, 0, 1, 0, 0, 1, 0],
                            [1, 1, 1, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 1, 1, 1, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 1, 1, 1],
                            [1, 0, 0, 0, 1, 0, 0, 0, 1],
                            [0, 0, 1, 0, 1, 0, 1, 0, 0]]
        // Get current moves of p1 and check if any is a winning position
        let p1Position = [].concat(...this.moves).map(a => a === 1 ? 1 : 0)
        let isP1win = winPositions.some(pos => isWinningPosition(p1Position, pos))
        // Get current moves of p2 and check if any is a winning position
        let p2Position = [].concat(...this.moves).map(a => a === 2 ? 1 : 0)
        let isP2win = winPositions.some(pos => isWinningPosition(p2Position, pos))
        // Get current moves and check if all boxes are filled
        let isAllFilled = [].concat(...this.moves).every(a => a !== 0)
        if (isP1win === false && isP2win === false && isAllFilled === true) {
            // Game ends when all box are filled (Tie)
            this.winner = 'Tie'
            this.ties += 1
            return true
        } else if (isP1win === true && isP2win === false) {
            // Game ends when p1 has winning position (Winner: Player 1)
            this.winner = 'Player 1'
            this.p1wins += 1
            return true
        } else if (isP1win === false && isP2win === true) {
            // Game ends when p2 has winning position (Winner: Player 2)
            this.winner = 'Player 2'
            this.p2wins += 1
            return true
        } else {
            // On other cases, game has not yet ended
            return false
        }
        function isWinningPosition(arr, winPosition) {
            let result = arr.map((a, i) => a === winPosition[i] ? true : winPosition[i] === 0 ? true : false).every(a => a === true)
            if (result) {
                game.winPosition = winPosition
                return true
            } else {
                return false
            }
        }
    }

    startNewGame() {
        // Reset game and switch turns
        this.turn = this.turn === 1 ? 2 : 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
        this.winPosition = undefined
        this.isFreeze = false
    }

    freeze() {
        // Disallow players to fill boxes
        this.isFreeze = true
    }

    save() {
        // Save current scores to local storage
        localStorage.setItem('ttt_p1Score', game.p1wins)
        localStorage.setItem('ttt_p2Score', game.p2wins)
        localStorage.setItem('ttt_tie', game.ties)
    }
    
    restoreSave() {
        this.p1wins = +localStorage.getItem('ttt_p1Score')
        this.p2wins = +localStorage.getItem('ttt_p2Score')
        this.ties = +localStorage.getItem('ttt_tie')
    }

    clearSave() {
        // Clear scores in local storage and reset to 0
        localStorage.clear('ttt_p1Score')
        localStorage.clear('ttt_p2Score')
        localStorage.clear('ttt_tie')
        game.p1wins = 0
        game.p2wins = 0
        game.ties = 0
    }

}


/**
 * DO ON LOAD
 */

// Start new game
let game = new Game

// Create local storage if there are no saved scores
if (localStorage.getItem('ttt_p1Score') === null) {
    localStorage.setItem('ttt_p1Score', 0)
    localStorage.setItem('ttt_p2Score', 0)
    localStorage.setItem('ttt_tie', 0)
}

// Restore saved scores
game.restoreSave()

// Display current scores in dom
showScoresDOM()


/**
 * EVENT LISTENERS
 */

// Listen for moves
document.querySelectorAll('.box').forEach(a => {
    a.addEventListener('click', function (e) {
        // Get coordinates of move
        let move = e.target.querySelector('.move')
        // Check if move is valid, otherwise do nothing
        if (game.isValidMove(move)) {
            // Place move on board and update dom
            game.placeMove(move)
            move.classList.add(`p${game.turn}`)
            // If game is ended, update dom and show message
            if (game.isGameEnd()) {
                // Highlight winning position 
                highlightWinDOM(game.winPosition)
                // Show current scores
                showScoresDOM()
                // Save scores
                game.save()
                // Freeze game
                game.freeze()
                // Show message and promp for new game
                showMessageDOM()
            // If game is not yet ended, change turn
            } else {
                game.changeTurn()
            }
        }
    }, false)
})

// Listen for clearing of scores
document.querySelector('#clear').addEventListener('click', function() {
    // Clear scores in local storage and update reset scores in dom
    game.clearSave()
    showScoresDOM()
})

// Listen for new game
document.querySelector('.newgame').addEventListener('click', function() {
    // Hide message and start new game
    document.querySelector('.result').style.display = 'none'
    game.startNewGame()
    clearBoardDOM()  
})


/**
 * FUNCTIONS
 */

// Helper function: Show result and ask user for new game
function showMessageDOM() { 
    // Determine style and text depending on the game result
    let alert = document.querySelector('.alert')
    let message = document.querySelector('.alert span')
    if (game.winner === 'Player 1') {
        alert.className = 'alert alert-danger'
        .innerHTML = 'Player 1 (Red) wins. Another game?'     
    } else if (game.winner === 'Player 2') {
        alert.className = 'alert alert-primary'
        message.innerHTML = 'Player 2 (Blue) wins. Another game?' 
    } else if (game.winner === 'Tie') {
        alert.className = 'alert alert-secondary'
        message.innerHTML = 'It is a tie. Another game?'   
    } 
    // Show message
    document.querySelector('.result').style.display = 'block'
}

// Helper function: Clear board
function clearBoardDOM() {
    document.querySelectorAll('.move').forEach(a => a.className = 'move')
}

// Helper function: Show scores in dom
function showScoresDOM() {
    document.querySelector('#p1Score').innerHTML = game.p1wins
    document.querySelector('#p2Score').innerHTML = game.p2wins
    document.querySelector('#ties').innerHTML = game.ties
}

// Helper function: Highlight winning position
function highlightWinDOM(winPosition) {
    (winPosition || []).map((a, i) => {
        if (a === 0) {
            return undefined
        } else {
            return {
                0: 'm00',
                1: 'm01',
                2: 'm02',
                3: 'm10',
                4: 'm11',
                5: 'm12',
                6: 'm20',
                7: 'm21',
                8: 'm22'
            }[i] || ['m00', 'm01', 'm02', 'm10', 'm11', 'm12', 'm20', 'm21', 'm22']
        }
    }).filter(a => a != undefined).forEach(a => document.querySelector(`#${a}`).classList.add('winBox'))
    document.querySelectorAll('.move').forEach(a => {
        if (!a.classList.contains('winBox')) {
            a.classList.add('dull')
        }
    })
}