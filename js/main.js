// Use strict
"use strict";

// Create tic-tac-toe object
class Game {
    
    constructor() {
        this.p1wins = 0
        this.p2wins = 0
        this.ties = 0
        this.turn = 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
    }

    placeMove(move) {
        let col = +move.id.split('-')[0]
        let row = +move.id.split('-')[1]
        this.moves[col][row] = this.turn
    }

    isValidMove(move) {
        let col = +move.id.split('-')[0]
        let row = +move.id.split('-')[1]
        if (this.moves[col][row] === 0) {
            return true
        } else {
            return false
        }
    }

    changeTurn() {
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
        let isP1win = winPositions.some(pos => isWinningPosition([].concat(...this.moves).map(a => a === 1 ? 1 : 0), pos))
        let isP2win = winPositions.some(pos => isWinningPosition([].concat(...this.moves).map(a => a === 2 ? 1 : 0), pos))
        let isAllFilled = [].concat(...this.moves).every(a => a !== 0)
        if (isP1win === false && isP2win === false && isAllFilled === true) {
            this.winner = 'Tie'
            this.ties += 1
            return true
        } else if (isP1win === true && isP2win === false) {
            this.winner = 'Player 1'
            this.p1wins += 1
            return true
        } else if (isP1win === false && isP2win === true) {
            this.winner = 'Player 2'
            this.p2wins += 1
            return true
        } else {
            return false
        }
        function isWinningPosition(arr, winPositions) {
            return arr.map((a, i) => a === winPositions[i] ? true : winPositions[i] ? false : true).every(a => a === true)
        }
    }

    startNewGame() {
        this.turn = 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
    }

}
let game = new Game

// Listen for placements
Array.from( document.querySelectorAll('.box') ).forEach(a => {
    a.addEventListener('click', function (e) {
        // Get move
        let move = e.target.querySelector('.move')
        // Check if move is valid
        if (game.isValidMove(move)) {
            // Place move on board
            game.placeMove(move)
            move.classList.add(`p${game.turn}`)
            // Chek if game should be ended
            if (game.isGameEnd()) {
                if (game.winner === 'Player 1') {
                    document.querySelector('#p1Score').innerHTML = game.p1wins     
                }
                if (game.winner === 'Player 2') {
                    document.querySelector('#p2Score').innerHTML = game.p2wins
                }
                if (game.winner === 'Tie') {
                    document.querySelector('#ties').innerHTML = game.ties
                }
                game.startNewGame()
                Array.from( document.querySelectorAll('.move')).forEach(a => {
                    a.className = 'move'
                }) 
            } else {
                game.changeTurn()
            }
        }
    }, false)
})