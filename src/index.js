import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.highlight) {
    return (
      <button className="square" onClick={props.onClick} style={{color: "red"}}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={'square_' + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.winnerLine.includes(i)}
      />
    );
  }

  render() {
    let items = [];
    let rows = [];
    for (var i = 0; i < 9; i++) {
      items.push(this.renderSquare(i));
      if ((i + 1) % 3 === 0) {
        rows.push(<div key={'row_' + (Math.floor(i / 3) + 1)} className="board-row">{items}</div>);
        items = [];
      }
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastStep: 'Game start',
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const location = this.convertLocation(i);
    const desc = squares[i] + ' moved to ' + location;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastStep: desc,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
    console.log(this.convertLocation(i));
  }

  convertLocation(i) {
    let x = Math.floor(i / 3) + 1;
    let y = i % 3 + 1;
    return '(' + x + ', ' + y + ')';
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  toggleSort() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winnerLine = calculateWinner(current.squares).line;
    const isAsc = this.state.isAsc;

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw game";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (!isAsc) {
      history = this.state.history.slice();
      history.reverse();
    }
    const moves = history.map((step, move) => {
      const desc = step.lastStep;
      if (isAsc) {
        if (move === this.state.stepNumber) {
          return (
            <li key={move}>
              <a href="javascropt:void(0);" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
            </li>
          );
        } else {
          return (
            <li key={move}>
              <a href="javascropt:void(0);" onClick={() => this.jumpTo(move)}>{desc}</a>
            </li>
          );
        }
      } else {
        if (history.length - 1 - move === this.state.stepNumber) {
          return (
            <li key={move}>
              <a href="javascropt:void(0);" onClick={() => this.jumpTo(history.length - 1 - move)}><strong>{desc}</strong></a>
            </li>
          );
        } else {
          return (
            <li key={move}>
              <a href="javascropt:void(0);" onClick={() => this.jumpTo(history.length - 1 - move)}>{desc}</a>
            </li>
          );
        }
      }
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>{this.state.isAsc ? 'Sort: Desc' : 'Sort: Asc'}</button>
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
      return {winner: squares[a], line:[a, b, c]};
    }
  }
  return {winner: null, line:[]};
}
