const displayController = (function() {

    function createCellElement(value, position) {
        const $cell = document.createElement('div');
        $cell.dataset.position = position
        $cell.className = 'cell';
        const $icon = document.createElement('span');
        if (value !== null) {
            $icon.className = 'material-symbols-outlined';
            value === 'O' ? $icon.textContent = 'circle' : $icon.textContent = 'close';
        }
        $cell.appendChild($icon);
        return $cell;
    }
    
    function displayBoard(board) {
        const $board = document.querySelector('.board');
        $board.innerHTML = '';
        board.forEach((cell, index) => {
            const $cell = createCellElement(cell, index);
            $cell.onclick = () => {game.handlePlaceMark(index)};
            $board.appendChild($cell);
        })
    }

    return {displayBoard}
})()

const gameboard = (function() {
    let board;

    function getValue(position) {
        return board[position];
    }
    function placeMark(index, value) {
        board[index] = value;
        displayController.displayBoard(board);
        console.log(board)
    }
    function resetBoard() {
        board = Array(9).fill(null);
        console.log(board)
        displayController.displayBoard(board);
    }

    function isFull() {
        return board.every(cell => cell !== null)
    }
    function getWinnerCombos() {
        return [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];
    }
    return {board /*ONLY TO TEST*/, getValue, placeMark, getWinnerCombos, resetBoard, isFull}
})()


function createPlayer(name, symbol) {
    let winnedGames = 0;

    function placeMark(index) {
        gameboard.placeMark(index, symbol)
    }   
    function getWinnedGames() {
        return winnedGames
    }
    function winGame() {
        winnedGames++;
    }
    function getSymbol() {
        return symbol;
    }
    return {name, getSymbol, placeMark, getWinnedGames, winGame}
}

const game = (function() {
    let playerOnTurn;
    const player1 = createPlayer('player 1', 'O');
    const player2 = createPlayer('player 2', 'X');
    function start() {
        gameboard.resetBoard();
        playerOnTurn = player1;
    }

    function newTurn() {
        playerOnTurn === player1 
            ? playerOnTurn = player2
            : playerOnTurn = player1
    }

    function getWinner() {
        for(const combo of gameboard.getWinnerCombos()) {
            const [a, b, c] = combo;
            if(
                gameboard.getValue(a) &&
                gameboard.getValue(a) === gameboard.getValue(b) && 
                gameboard.getValue(a) === gameboard.getValue(c)
                ) {
                    if (gameboard.getValue(a) === player1.getSymbol()) {
                        return player1;
                    }
                    return player2;
            }
        }
    }

    function isGameOver() {
        return (gameboard.isFull() || getWinner() !== undefined);
    }

    function handlePlaceMark(position) {
        if(gameboard.getValue(position) === null) {
            playerOnTurn.placeMark(position)
            newTurn();
        }
        if(isGameOver()) {
            end();
        }
    }

    function end() {
        const $cells = document.querySelectorAll('.board .cell');
        $cells.forEach($cell => {
            $cell.onclick = {};
        })
        const $resultText = document.querySelector('.result-text'); 
        const winner = getWinner();
        console.log(winner)
        if(winner === undefined) {
            $resultText.textContent = 'Draw!'
        }
        else if(winner.name === player1.name) {
            $resultText.textContent = 'Player 1 wins!'
        } else {
            $resultText.textContent = 'Player 2 wins!'
        }
        $resultText.style.visibility = 'visible';
    }
    return {start, handlePlaceMark, end}
})()

game.start();