import React from 'react';
import ReactDOM from 'react-dom';
import ArrowKeysReact from './arrow-keys.js';
import './index.css';

function Square(props) {
  return (
    <div className="square">
      {props.value}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
      />
    );
  }

  buildBoard = () => {
    let board = [];

    for (let i = 0; i < 4; i++) {
      let children = [];
      for (let j = 0; j < 4; j++) {
        children.push(this.renderSquare(i, j));
      }
      board.push(<div className="board-row">
                  {children}
                  </div>)
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.buildBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [Array(4).fill(null),
                Array(4).fill(null),
                Array(4).fill(null),
                [null, 2, null, null]],
      won: false,
      lost: false
    };

    this.addRando = this.addRando.bind(this);

    ArrowKeysReact.config({
      left: () => {this.handleClick('left')},
      right: () => {this.handleClick('right')},
      up: () => {this.handleClick('up')},
      down: () => {this.handleClick('down')}
    });
  }

  handleClick(direc) {
    let squares = this.state.squares.slice(0);
    let newSq = [Array(4).fill(null), Array(4).fill(null),Array(4).fill(null),
                 Array(4).fill(null)];
    let checkMe = true;
    let changed = false;

    if (direc === 'left') {
      for (let i = 0; i < 4; i++) {
        const thisRow = squares[i].filter(val => val);
        for (let j = 0; j < thisRow.length; j++) {
          // if something moved while generating thisRow, it will end up in a different place than originally
          // so, a new number should be generated
          if (thisRow[j] !== squares[i][j]) {changed = true};

          if (checkMe) {
            let openSq = newSq[i].indexOf(null);
            // if the squares need to be summed, the next square doesn't need to be checked again
            if (thisRow[j + 1] === thisRow[j]) {
              newSq[i][openSq] = 2 * thisRow[j];
              checkMe = !checkMe;
              // if squares were summed, something has changed -> new number added
              changed = true;
            } else {
              newSq[i][openSq] = thisRow[j];
            }
          } else {
            // if it wasn't checked because the square was already summed, the next square does need to be checked
            checkMe = !checkMe;
          }
        }
      }
    } else if (direc === 'right') {
      for (let i = 0; i < 4; i++) {
        const thisRow = squares[i].filter(val => val);
        for (let j = thisRow.length - 1; j >= 0; j--) {
          if (thisRow[j] !== squares[i][Math.abs(3 - j)]) {changed = true};

          if (checkMe) {
            let openSq = newSq[i].lastIndexOf(null);
            if (thisRow[j - 1] === thisRow[j]) {
              newSq[i][openSq] = 2 * thisRow[j];
              checkMe = !checkMe;
              changed = true;
            } else {
              newSq[i][openSq] = thisRow[j];
            }
          } else if (!checkMe) {
            checkMe = !checkMe;
          }
        }
      }
    } else if (direc === 'up') {
      for (let j = 0; j < 4; j++) {

        // build thisCol
        let thisCol = [];
        for (let row = 0; row < 4; row++) {
          if (squares[row][j]) {thisCol.push(squares[row][j])}
        }

        for (let i = 0; i < thisCol.length; i++) {
          if (thisCol[i] !== squares[i][j]) {changed = true};

          if (checkMe) {
            let openSq;
            // find the open squares
            for (let k = 3; k >= 0; k--) {
              if (!newSq[k][j]) {openSq = k;}
            }
            // otherwise tries to read squares[4][j] which throws error
            if (thisCol[i + 1]) {
              if (thisCol[i + 1] === thisCol[i]) {
                newSq[openSq][j] = 2 * thisCol[i];
                checkMe = !checkMe;
                changed = true;
              } else {
                newSq[openSq][j] = thisCol[i];
              }
            } else {
              newSq[openSq][j] = thisCol[i];
            }
          } else {
            checkMe = !checkMe;
          }
        }
      }
    } else if (direc === 'down') {
      for (let j = 0; j < 4; j++) {

        let thisCol = [];
        for (let row = 0; row < 4; row++) {
          if (squares[row][j]) {thisCol.push(squares[row][j])}
        }

        for (let i = thisCol.length - 1; i >= 0; i--) {
          if (thisCol[i] !== squares[Math.abs(3 - i)][j]) {changed = true};

          if (checkMe) {
            let openSq;
            // find the open squares
            for (let k = 0; k < 4; k++) {
              if (!newSq[k][j]) {openSq = k;}
            }

            if (thisCol[i - 1]) {
              if (thisCol[i - 1] === thisCol[i]) {
                newSq[openSq][j] = 2 * thisCol[i];
                checkMe = !checkMe;
                changed = true;
              }
              else {
                newSq[openSq][j] = thisCol[i];
              }
            } else {
              newSq[openSq][j] = thisCol[i];
            }
          } else if (!checkMe) {
            checkMe = !checkMe;
          }
        }
      }
    }

    if (changed) {
      this.addRando(newSq);
    }

    this.setState({
      squares: newSq
    });
  }

  addRando(squares) {
    let options = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!squares[i][j]) {
          options.push([i, j]);
        }
        if (squares[i][j] >= 2048) {
          this.setState({
            won: true
          })
        }
      }
    };

    if (options.length > 0) {
      let choice = options[Math.floor(Math.random() * Math.floor(options.length))];
      let whichVal = Math.random();
      squares[choice[0]][choice[1]] = whichVal < 0.75 ? 2 : 4;
    }
    return squares;
  }

  render() {

    let status;

    if (this.state.won) {
      status = "You won!"
    }

    return (
      <div className="game">
        <div className="game-board" {...ArrowKeysReact.events} tabIndex="1">
          <Board
            squares={this.state.squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
