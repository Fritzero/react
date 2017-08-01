import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, color) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={{backgroundColor: color}}
      />
    );
  }

  renderRow(num){
    var row = [];
    for (var i=num; i<(num+3); i++ ) {
      row.push(this.renderSquare(i));
    }
    return (
      <div className="board-row">{row}</div>
    );
  }

  render() {
    var grid = [];
    for (var i=0; i<3; i++ ) {
      grid.push(this.renderRow(i*3));
    }
    return (
      <div>{grid}</div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDesc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastClick: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  flipButtonClickHandler() {
    if (this.state.isDesc === true) {
      this.setState({
        isDesc: false
      });
    }
    else {
      this.setState({
        isDesc: true
      });
    }
  }

  boldCurrentStepNumber(stepNumber, move, desc) {
    if (stepNumber === move){
      return <b><a href="#" onClick={() => this.jumpTo(move)}>{desc}</a></b>
    }
    else {
      return <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningCombo = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ? "Move #" + move + " -> location: (" + getCoordinates(step.lastClick) + ")" : "Game start";
      return (
        <li key={move}>
          {this.boldCurrentStepNumber(this.state.stepNumber, move, desc)}
        </li>
      );
    });
    if (this.state.isDesc === false) {
      moves = moves.reverse();
    }

    let status;
    if (winningCombo) {
      status = "Winner: " + (this.state.xIsNext ? "O" : "X"); //Takes the value of the squares
      for (let i=0; i<3; i++){
        let j = winningCombo[i];
        current.squares[j] =
            <button className="square" style={{backgroundColor: "#008CBA"}}>
            </button>
      }
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="flip-ordering-button">
            <button onClick={() => this.flipButtonClickHandler()}> {this.state.isDesc ? 'DESC' : 'ASC'}</button>
          </div>
          <ol>{moves}</ol>

        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function getCoordinates(location) {
  const coordinates = [
    [1,1],
    [2,1],
    [3,1],
    [1,2],
    [2,2],
    [3,2],
    [1,3],
    [2,3],
    [3,3]
  ];
  return coordinates[location];
}
