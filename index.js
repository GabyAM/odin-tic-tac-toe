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
    function isEmpty() {
        return board.every(cell => cell === null)
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
    return {getValue, placeMark, getWinnerCombos, resetBoard, isFull, isEmpty}
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
    function getName() {
        return name;
    }
    function changeName(newName) {
        name = newName;
    }
    return {getName, getSymbol, placeMark, getWinnedGames, winGame, changeName}
}

const game = (function() {
    let playerOnTurn;
    const player1 = createPlayer('player 1', 'O');
    const player2 = createPlayer('player 2', 'X');
    function start() {
        gameboard.resetBoard();
        playerOnTurn = player1;
        const $resetButton = document.querySelector('.reset-button');
        $resetButton.addEventListener('click', () => {
            start();
        })
        toggleNameChange()
    }

    function toggleNameChange() {
        const $changeNameInputs = document.querySelectorAll('.player-info input');
        $changeNameInputs.forEach($input => {
            if ($input.onchange === null) {
                $input.disabled = false
                $input.onchange = () => {
                    $input.parentElement.classList.contains('player-1') ?
                        player1.changeName($input.value)
                        : player2.changeName($input.value)
                }
            } else {
                $input.onchange = null;
                $input.disabled = true
            }
    })
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
        if(gameboard.isEmpty()) {
            toggleNameChange()
        }
        if(gameboard.getValue(position) === null) {
            playerOnTurn.placeMark(position)
            newTurn();
        }

        if(isGameOver()) {
            end();
        }
    }

    function showResultMessage() {
        const $resultText = document.querySelector('.result-text'); 
        const winner = getWinner();
        console.log(winner)
        if(winner === undefined) {
            $resultText.textContent = 'Draw!'
        }
        else if(winner.getName() === player1.getName()) {
            $resultText.textContent = `${player1.getName()} wins!`
        } else {
            $resultText.textContent = `${player2.getName()} wins!`
        }
        const $result = document.querySelector('.result');
        $result.style.visibility = 'visible';
        $result.style.opacity = '0';
        setTimeout(() => {
            $result.style.visibility = 'hidden';
            $result.style.opacity = '1';
        }, 5000)
    }

    function end() {
        const $cells = document.querySelectorAll('.board .cell');
        $cells.forEach($cell => {
            $cell.onclick = {};
        })
        showResultMessage()
        toggleNameChange('enable');
    }

    return {start, handlePlaceMark}
})()

game.start();