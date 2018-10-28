import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
    { props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {

    const squareSideCount = 3;
    let sqares = [];

    for (let rowNo = 0; rowNo < squareSideCount; rowNo++) {
      let row = [];
      for (let colNo = 0; colNo < squareSideCount; colNo++) {
        row.push(this.renderSquare(rowNo * squareSideCount + colNo));
      }
      sqares.push(
        <div
          key={rowNo}
          className="board-row"
        >
        {row}
        </div>
      )
    }

    return (
      <div>
        {sqares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortHistoryAsc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: getLocationFromSquareNo(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    })
  }

  toggleHistorySort() {
    this.setState({
      sortHistoryAsc: !this.state.sortHistoryAsc
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => { // currentValue, index
      let desc = move ? 'Go to move #' + move :'Go to game start';

      const location = step.location;
      if (location) {
        desc += '(' + location.col + ', ' + location.row + ')';
      }

      // Bold the currently selected item in the move list.
      let className = 'move-button';
      if (this.state.stepNumber === move) {
        className += ' move-button-current';
      }

      return (
        <li key={move}>
          <button
            className={className}
            onClick={() => this.jumpTo(move)}
          >{desc}</button>
        </li>
      );
    });


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.toggleHistorySort()}
          >toggle sort</button>
          <ol>{this.state.sortHistoryAsc ? moves: moves.reverse()}</ol>
        </div>
      </div>
  );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;

}


/**
 * @param no
 * @returns {{col: number, row: number}}
 */
function getLocationFromSquareNo(no) {
  return {
    col: no % 3,
    row: Math.floor(no / 3),
  }
}


// ========================================

ReactDOM.render(
<Game />,
  document.getElementById('root')
);
