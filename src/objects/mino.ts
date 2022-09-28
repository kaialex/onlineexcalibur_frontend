import { Actor, Color, Scene, vec, Vector } from "excalibur";
import { MinoProps, block } from "./minodata";

class Mino extends Actor {
  _game: Scene;
  _blocksize: number;
  _targetmino: MinoProps;
  _blocks: Actor[] = [];
  _leftuppos: Vector;

  constructor(
    game: Scene,
    pos: Vector,
    gridpos: Vector,
    minodata: MinoProps,
    blocksize: number
  ) {
    super({
      x: pos.x + gridpos.x * blocksize,
      y: pos.y + gridpos.y * blocksize,
    });
    this._game = game;
    this._blocksize = blocksize;
    this._targetmino = minodata;
    this._leftuppos = pos;
  }

  onInitialize(): void {
    this.drawMino();
  }

  drawMino(): void {
    this._blocks.forEach((block) => {
      block.kill();
    });
    this._blocks = [];

    for (let i = 0; i < this._targetmino.blockdata.length; i++) {
      for (let j = 0; j < this._targetmino.blockdata[i].length; j++) {
        if (this._targetmino.blockdata[i][j] === 1) {
          this._blocks.push(
            new Actor({
              pos: vec(
                this.pos.x + j * this._blocksize + this._blocksize / 2,
                this.pos.y + i * this._blocksize + this._blocksize / 2
              ),
              width: this._blocksize,
              height: this._blocksize,
              color: Color.fromHex(this._targetmino.color),
              z: 3,
            })
          );
        }
      }
    }

    this._blocks.forEach((block) => {
      this._game.add(block);
    });
  }

  kill() {
    super.kill();
    this._blocks.forEach((block) => {
      block.kill();
    });
  }

  updatePos(gridpos: Vector): void {
    this.pos.x = this._leftuppos.x + gridpos.x * this._blocksize;
    this.pos.y = this._leftuppos.y + gridpos.y * this._blocksize;
    this.drawMino();
  }

  updateBlockData(blockdata: block[][]): void {
    console.log(blockdata);
    this._targetmino.blockdata = blockdata;
    this.drawMino();
  }
}

export default Mino;
