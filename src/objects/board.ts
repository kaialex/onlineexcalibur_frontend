import { Actor, Color, Scene, ScreenElement, Vector } from "excalibur";
import { colorPalatte } from "./minodata";

class Board {
  private _currentboard: number[][];
  private _blocksize: number;
  private _blocks: Actor[] = [];
  private _game: Scene;
  _pos: Vector;

  constructor(
    game: Scene,
    pos: Vector,
    width: number,
    height: number,
    blocksize: number,
    currentboard?: number[][]
  ) {
    currentboard
      ? (this._currentboard = currentboard)
      : (this._currentboard = Array((height / blocksize) | 0)
          .fill(0)
          .map(() => Array((width / blocksize) | 0).fill(0)));
    this._blocksize = blocksize;
    this._game = game;
    this._pos = pos;
  }

  drawBoard(): void {
    this._blocks.forEach((block) => {
      block.kill();
    });
    this._blocks = [];

    for (let i = 0; i < this._currentboard.length; i++) {
      for (let j = 0; j < this._currentboard[i].length; j++) {
        if (this._currentboard[i][j] === 0) continue;
        this._blocks.push(
          new Actor({
            x: j * this._blocksize + this._pos.x + this._blocksize / 2,
            y: i * this._blocksize + this._pos.y + this._blocksize / 2,
            width: this._blocksize,
            height: this._blocksize,
            color: colorPalatte[this._currentboard[i][j]],
            z: 2,
          })
        );
      }
    }

    this._blocks.forEach((block) => {
      this._game.add(block);
    });
  }

  public updateBoard(board: number[][]): void {
    this._currentboard = board;
    this.drawBoard();
  }

  public resetBoard(): void {
    for (let i = 0; i < this._currentboard.length; i++) {
      for (let j = 0; j < this._currentboard[i].length; j++) {
        this._currentboard[i][j] = 0;
      }
    }
    this.drawBoard();
  }
}

export default Board;
