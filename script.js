// DISPLAY / UI

import { 
    createBoard, 
    markTile, 
    TILE_STATUSES, 
    revealTile,
    checkWin,
    checkLose,
} from './minesweeper.js'

let BOARD_SIZE = parseInt(window.name, 10)
const NUMBER_OF_MINES = Math.floor((BOARD_SIZE * BOARD_SIZE) / 7)

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

document.getElementById('togglee').style.visibility = 'hidden'

document.querySelector("#togglee").addEventListener('click', () => {
    document.location.reload()
})

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {

    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, {capture : true})
        boardElement.addEventListener("contextmenu", stopProp, {capture : true})
        document.getElementById('togglee').style.visibility = 'visible'
    }

    if (win) {
        messageText.textContent = "You Won!"
    }

    if (lose) {
        messageText.textContent = "You Lost!"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) tile.status = TILE_STATUSES.HIDDEN
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

document.getElementById('board_size').addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        //e.preventDefault()
        window.name = document.getElementById('board_size').value
    }
})