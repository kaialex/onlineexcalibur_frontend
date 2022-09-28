import { Engine, Input, Scene, SceneActivationContext, vec } from "excalibur";
import Frame from "../objects/frame";
import Board from "../objects/board";
import Mino from "../objects/mino";
import { connection } from "../api/socketConnection";
import { block, MinoProps } from "../objects/minodata";

class PlayGame extends Scene {
  private _game: Engine;
  private _score: number;
  private _board!: Board;
  private _currentMino: Mino | undefined;

  constructor(game: Engine) {
    super();
    this._game = game;
    this._score = 0;
  }

  public onInitialize(_engine: Engine): void {
    //大きな枠を生成する
    const frame = new Frame(this, this._game.screen.center, 320, 620, 10);

    //全体盤面の生成
    this._board = new Board(this, frame.innerpos_leftup, 300, 600, 30);

    this.add(frame);

    //通信イベントを作成

    //ミノが動いた
    connection?.addSocketEvent(
      "updateMino",
      (data: { pos?: { x: number; y: number }; blockdata?: block[][] }) => {
        if (data.pos !== undefined) {
          this._currentMino?.updatePos(vec(data.pos.x, data.pos.y));
        }
        if (data.blockdata !== undefined) {
          this._currentMino?.updateBlockData(data.blockdata);
        }
      }
    );

    //新たなミノを生成する
    connection?.addSocketEvent(
      "makeMino",
      (data: {
        nextboard: number[][];
        nextmino: MinoProps;
        startpos: { x: number; y: number };
      }) => {
        this.makeNextMino(data);
      }
    );

    //ラインを消すイベント
    connection?.addSocketEvent("deleteLine", (dissapeared_line: number[]) => {
      this.dissapearedLineAction(dissapeared_line);
    });

    connection?.addSocketEvent("startCountDown", (data: any) => {
      this.startCountDown();
    });

    //ゲームオーバー
    connection?.addSocketEvent("backToTitle", (data: any) => {
      alert(data.message);
      this._board.resetBoard();
      this._currentMino?.kill();
      this._game.goToScene("title");
    });
  }

  public onActivate(_context: SceneActivationContext<unknown>): void {
    this._score = 0;
    this._game.clock.schedule(() => {
      connection?.emitMessage("readyStart");
    }, 1000);
  }

  public startCountDown() {
    console.log("countdown");
    this._game.clock.schedule(() => {
      connection?.emitMessage("readyStart");
    }, 3000);
  }

  public update(_engine: Engine, _delta: number): void {
    super.update(_engine, _delta);
    if (_engine.input.keyboard.wasPressed(Input.Keys.Right)) {
      this.MoveMino("right");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.Left)) {
      this.MoveMino("left");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.Down)) {
      connection?.emitMessage("dropMino");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.Q)) {
      connection?.emitMessage("rotateMino", "left");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.E)) {
      connection?.emitMessage("rotateMino", "right");
    }
  }

  public MoveMino(direction: "left" | "right") {
    connection?.emitMessage("moveMino", direction);
  }

  public makeNextMino(data: {
    nextboard: number[][];
    nextmino: MinoProps;
    startpos: { x: number; y: number };
  }) {
    if (this._currentMino !== undefined) {
      this._currentMino.kill();
    }
    this._board.updateBoard(data.nextboard);
    this._currentMino = new Mino(
      this,
      this._board._pos,
      vec(data.startpos.x, data.startpos.y),
      data.nextmino,
      30
    );
    this.add(this._currentMino);
  }

  public dissapearedLineAction(dissapeared_line: number[]) {
    console.log(dissapeared_line);
    console.log("消えるアクション");
  }
}

export default PlayGame;
