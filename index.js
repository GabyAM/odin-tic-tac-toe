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
    return {board /*ONLY TO TEST*/, getValue, placeMark, resetBoard}
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


