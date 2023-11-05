
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


