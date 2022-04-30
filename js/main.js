// Use strict
"use strict";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    placeMove(piece) {
        let col = +piece.id.split('-')[0]
        let row = +piece.id.split('-')[1]
        this.moves[col][row] = this.turn
    }

    isValidMove(piece) {
        let col = +piece.id.split('-')[0]
        let row = +piece.id.split('-')[1]
        if (this.moves[col][row] === 0) {
            return true
        } else {
            return false
        }
    }

    changeTurn() {
        this.turn = this.turn === 1 ? 2 : 1
    }

    checkWinner() {
        let wins = [[1, 0, 0, 1, 0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 0, 1, 0],
                    [1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1],
                    [0, 0, 1, 0, 1, 0, 1, 0, 0]]
        let isP1win = wins.some(win => isWinningPosition([].concat(...this.moves).map(a => a === 1 ? 1 : 0), win))
        let isP2win = wins.some(win => isWinningPosition([].concat(...this.moves).map(a => a === 2 ? 1 : 0), win))
        let isAllFilled = [].concat(...this.moves).every(a => a !== 0)
        if (isP1win === true && isP2win === true) {
            return 'Something is wrong'  
        } else if (isP1win === false && isP2win === false && isAllFilled === true) {
            this.winner = 'Tie'
            this.ties += 1
        } else if (isP1win === false && isP2win === false) {
            return 'No winner yet'
        } else if (isP1win === true && isP2win === false) {
            this.winner = 'Player 1'
            this.p1wins += 1
        } else  {
            this.winner = 'Player 2'
            this.p2wins += 1
        }
        function isWinningPosition(arr, winPositions) {
            return arr.map((a, i) => a === winPositions[i] ? true : winPositions[i] ? false : true).every(a => a === true)
        }
    }

    newGame() {
        this.turn = 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
    }

}
let game = new Game

// Listen for placements
Array.from( document.querySelectorAll('.box') ).forEach(a => {
    a.addEventListener('click', function (e) {
        let piece = e.target.querySelector('.piece')
        if (game.isValidMove(piece)) {
            game.placeMove(piece)
            piece.classList.add(`p${game.turn}`)
            game.checkWinner()
            if (game.winner === 'Player 1') {
                document.querySelector('#p1Score').innerHTML = game.p1wins
                game.newGame()
                Array.from( document.querySelectorAll('.piece')).forEach(a => {
                    a.className = 'piece'
                }) 
            }
            if (game.winner === 'Player 2') {
                document.querySelector('#p2Score').innerHTML = game.p2wins
                game.newGame()
                Array.from( document.querySelectorAll('.piece')).forEach(a => {
                    a.className = 'piece'
                }) 
            }
            if (game.winner === 'Tie') {
                document.querySelector('#ties').innerHTML = game.ties
                game.newGame()
                Array.from( document.querySelectorAll('.piece')).forEach(a => {
                    a.className = 'piece'
                }) 
            }
            game.changeTurn()
        }
    }, false)
})