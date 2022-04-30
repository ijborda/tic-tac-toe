// Use strict
"use strict";

// Create Local Storage
if (localStorage.getItem('ttt_p1Score') === null) {
    localStorage.setItem('ttt_p1Score', 0)
    localStorage.setItem('ttt_p2Score', 0)
    localStorage.setItem('ttt_tie', 0)
}

// Create tic-tac-toe object
class Game {
    
    constructor() {
        this.p1wins = +localStorage.getItem('ttt_p1Score')
        this.p2wins = +localStorage.getItem('ttt_p2Score')
        this.ties = +localStorage.getItem('ttt_tie')
        this.turn = 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
        this.winPosition = undefined
        this.isFreeze = false
    }

    placeMove(move) {
        let col = +move.id[1]
        let row = +move.id[2]
        this.moves[col][row] = this.turn
    }

    isValidMove(move) {
        let col = +move.id[1]
        let row = +move.id[2]
        if (this.isFreeze) {
            return false
        } else if (this.moves[col][row] === 0) {
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
        let p1Position = [].concat(...this.moves).map(a => a === 1 ? 1 : 0)
        let p2Position = [].concat(...this.moves).map(a => a === 2 ? 1 : 0)
        let isP1win = winPositions.some(pos => isWinningPosition(p1Position, pos))
        let isP2win = winPositions.some(pos => isWinningPosition(p2Position, pos))
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
        this.turn = 1
        this.moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.winner = undefined
        this.winPosition = undefined
        this.isFreeze = false
    }

    freeze() {
        this.isFreeze = true
    }

}
let game = new Game
document.querySelector('#p1Score').innerHTML = game.p1wins
document.querySelector('#p2Score').innerHTML = game.p2wins
document.querySelector('#ties').innerHTML = game.ties


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
                    document.querySelector('.alert').className = 'alert alert-danger'
                    document.querySelector('.alert span').innerHTML = 'Player 1 (Red) wins. Another game?'     
                }
                else if (game.winner === 'Player 2') {
                    document.querySelector('#p2Score').innerHTML = game.p2wins
                    document.querySelector('.alert').className = 'alert alert-primary'
                    document.querySelector('.alert span').innerHTML = 'Player 2 (Blue) wins. Another game?' 
                }
                else if (game.winner === 'Tie') {
                    document.querySelector('#ties').innerHTML = game.ties
                    document.querySelector('.alert').className = 'alert alert-secondary'
                    document.querySelector('.alert span').innerHTML = 'It is a tie. Another game?'   
                } 
                dullColors(game.winPosition)
                saveScores()
                game.freeze()
                isStartNewGame()
                // if (isStartNewGame()) {
                //     game.startNewGame()
                //     Array.from( document.querySelectorAll('.move')).forEach(a => {
                //         a.className = 'move'
                //     }) 
                // }
            } else {
                game.changeTurn()
            }
        }
    }, false)
})

function dullColors(winPosition) {
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
    let moves = document.querySelectorAll('.move')
    Array.from(moves).forEach(a => {
        if (!a.classList.contains('winBox')) {
            a.classList.add('dull')
        }
    })
}

function isStartNewGame() {
    let reply = undefined
    document.querySelector('.result').style.display = 'block'
    // console.log(reply)
    return reply
}

let newGameBtn = document.querySelectorAll('.newgame')
Array.from(newGameBtn).forEach(a => {
    a.addEventListener('click', function(e) {
        document.querySelector('.result').style.display = 'none'
        if (e.target.id === 'yes') {
            game.startNewGame()
            Array.from( document.querySelectorAll('.move')).forEach(a => {
                a.className = 'move'
            }) 
        }
    })
    
})

function saveScores() {
    // Local storage
    localStorage.setItem('ttt_p1Score', game.p1wins)
    localStorage.setItem('ttt_p2Score', game.p2wins)
    localStorage.setItem('ttt_tie', game.ties)
}

document.querySelector('#clear').addEventListener('click', function() {
    localStorage.clear('ttt_p1Score')
    localStorage.clear('ttt_p2Score')
    localStorage.clear('ttt_tie')
    game.p1wins = 0
    game.p2wins = 0
    game.ties = 0
    document.querySelector('#p1Score').innerHTML = game.p1wins
    document.querySelector('#p2Score').innerHTML = game.p2wins
    document.querySelector('#ties').innerHTML = game.ties
})