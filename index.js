function App() {

    //use state hooks for the board, who's playing, the scores and game over
    const [board, setBoard] = React.useState([null, null, null, null, null, null, null, null, null]);
    const [xPlaying, setXPlaying] = React.useState(true);
    const [scores, setScores] = React.useState({xScore: 0, oScore: 0});
    const [gameOver, setGameOver] = React.useState(false);

    //these are all of the possible win conditions and their indexes
    const WIN_CONDITIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    //function that runs when a box is clicked.
    const handleClick = (boxIndex) => {
        //create new version of the board that reflects the box that was clicked.
        const updatedBoard = board.map((value, index) => {
            //if the index of the list is equal to the index of the box that was clicked, then do something.
            if (index === boxIndex) {
                //if xPlaying is currently equal to true, then return 'X' for the value of the new updated board at that index.
                return xPlaying === true ? 'X' : 'O';
            } else {
                //if the user didn't click this index, then just return the current value which is null.
                return value;
            }
        })

        //function to check if there has been a winner and to update score each time the board has been clicked.
        //assign the variable winner to a boolean value. true if there has been a winner, false otherwise.
        const winner = checkWin(updatedBoard);
        //if there has been a winner, then update the score depending on who won.
        if (winner) {
            //if the winner is x, then deconstruct xScore from the scores state.
            //use the spread operator to override the xScore variable.
            if (winner == 'X') {
                let {xScore} = scores;
                xScore += 1;
                setScores({...scores, xScore}); 
              //if the winner is o, then deconstruct oScore from the scores state.
              //use the spread operator to override the oScore variable.
            } else {
                let {oScore} = scores;
                oScore += 1;
                setScores({...scores, oScore});
            }
        }
        //always set the board to the new updatedBoard and change who is playing after each click.
        setBoard(updatedBoard);
        setXPlaying(!xPlaying);
    }

    //function to check if there has been a winner. Takes in the current board and checks if winning conditions have been met.
    const checkWin = (board) => {
        for (let i = 0; i < WIN_CONDITIONS.length; i++) {
            const [x, y, z] = WIN_CONDITIONS[i];
            if (board[x] && board[x] === board[y] && board[y] === board[z]) {
                setGameOver(true);
                return board[x];
            }
        }
    }

    //function to reset the board back to empty and setGameOver back to false so play can resume.
    const resetBoard = () => {
        setGameOver(false);
        setBoard([null, null, null, null, null, null, null, null, null]);
    }

    return (
        <div className='App'>
            <Title />
            <ScoreBoard scores={scores} xPlaying={xPlaying} />
            <Board board={board} onClick={gameOver ? resetBoard : handleClick} />
            <ResetButton resetBoard={resetBoard} />
        </div>
    )
}



//Board component that takes in the board, which is a state hook, and an onClick function as props.
//loop through the board, which is a list of 9 values, and return a box component for each value.
//run the onClick function and pass in the current index of the box as a parameter.
//only run the onClick function if the value is equal to null.
function Board({board, onClick}) {

    return (
        <div className='board'>
            {board.map((value, index) => {
                return <Box value={value} onClick={() => {if (value === null) onClick(index)}} />
            })}
        </div>
    )
}

//Box component that takes in a value and an onClick function as props.
function Box({ value, onClick}) {

    //if the value is equal to 'X', then assign the classname of 'box x'. 'box o' otherwise.
    const style = value === 'X' ? 'box x' : 'box o';

    return (
        <button className={style} onClick={onClick}>
            {value}
        </button>
    )
}

//Scoreboard component.
function ScoreBoard({scores, xPlaying}) {
    const {xScore, oScore} = scores;

    return (
        <div className='scoreboard'>
            <span className={`score x-score ${!xPlaying && 'inactive'}`}>X Score: {xScore}</span>
            <span className={`score o-score ${xPlaying && 'inactive'}`}>O Score: {oScore}</span>
        </div>
    )
}


//reset button component.
function ResetButton({resetBoard}) {
    return (
        <button className='reset-btn' onClick={resetBoard}>Reset Board</button>
    )
}

//title component.
function Title() {
    return (
        <h1 className='title'>
            Tic Tac Toe
        </h1>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))