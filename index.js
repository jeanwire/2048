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
      squares: [[2, null, null, null],
                Array(4).fill(null),
                Array(4).fill(null),
                [null, null, null, null]],
      won: false,
      lost: false
    };

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
    let checkThisNum = true;
    let changed = false;

    if (direc === 'left') {
      for (let i = 0; i < 4; i++) {
        // need to change this as object is being returned
        let temp = this.parseRow(squares[i]);
        let {row: tempRow, changed: tempChanged} = temp;
        newSq[i] = tempRow;
        if (!changed) {changed = tempChanged};
      }
    } else if (direc === 'right') {
      for (let i = 0; i < 4; i++) {
        let temp = this.parseRow(squares[i].reverse());
        let {row: tempRow, changed: tempChanged} = temp;
        newSq[i] = tempRow.reverse();
        if (!changed) {changed = tempChanged};
      }
    } else if (direc === 'up') {
      for (let j = 0; j < 4; j++) {

        // build thisCol
        let thisCol = [];
        for (let i = 0; i < 4; i++) {
          thisCol.push(squares[i][j]);
        }

        let temp = this.parseRow(thisCol);
        let {row: tempCol, changed: tempChanged} = temp;
        for (let i = 0; i < 4; i++) {
          newSq[i][j] = tempCol[i];
        }
        if (!changed) {changed = tempChanged};
      }
    } else if (direc === 'down') {
      for (let j = 0; j < 4; j++) {

        let thisCol = [];
        for (let i = 3; i >= 0; i--) {
          thisCol.push(squares[i][j]);
        }

        let temp = this.parseRow(thisCol);
        let {row: tempCol, changed: tempChanged} = temp;
        for (let i = 3; i >= 0; i--) {
          newSq[i][j] = tempCol[3 - i];
        }
        if (!changed) {changed = tempChanged};
      }
    }

    if (changed) {
      this.addRando(newSq);
    }

    this.setState({
      squares: newSq
    });
  }

  parseRow = (row) => {

    let thisRow = row.filter(val => val);
    let newRow = Array(4).fill(null);
    let emptySq = 0;
    let changed = false;
    let checkThisNum = true;

    for (let i = 0; i < thisRow.length; i++) {
      if (thisRow[i] !== row[i]) {changed = true};

      if (checkThisNum) {
        if (thisRow[i + 1] === thisRow[i]) {
          newRow[emptySq] = 2 * thisRow[i];
          emptySq++;
          checkThisNum = !checkThisNum;
          changed = true;
        } else {
          newRow[emptySq] = thisRow[i];
          emptySq++;
        }
      } else {checkThisNum = !checkThisNum;}
    }

    return {row: newRow, changed: changed};
  }

  addRando = (squares) => {
    let emptySq = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!squares[i][j]) {
          emptySq.push([i, j]);
        }
        if (squares[i][j] >= 2048) {
          this.setState({
            won: true
          })
        }
      }
    };

    if (emptySq.length > 0) {
      let choice = emptySq[Math.floor(Math.random() * Math.floor(emptySq.length))];
      let whichVal = Math.random();
      squares[choice[0]][choice[1]] = whichVal < 0.75 ? 2 : 4;
    }
    return squares;
  }

  render() {
    return (
      <div className="game">
        <div className="game-board" {...ArrowKeysReact.events} tabIndex="1">
          <Board
            squares={this.state.squares}
          />
        </div>
        <div className="game-info">
          <div>{this.state.won ? "You won!" : ''}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
