import {
  BaseAlign,
  Engine,
  Font,
  Input,
  Label,
  Scene,
  SceneActivationContext,
  TextAlign,
  vec,
} from "excalibur";
import Frame from "../objects/frame";
import Board from "../objects/board";
import Mino from "../objects/mino";
import { connection } from "../api/socketConnection";
import { block, MinoProps } from "../objects/minodata";

class PlayGame extends Scene {
  private _game: Engine;
  private _board!: Board;
  private _currentMino: Mino | undefined;

  private _turnlabel!: Label;
  private _scorelabel!: Label;

  private readonly _blocksize: number = 25;

  constructor(game: Engine) {
    super();
    this._game = game;
  }

  public onInitialize(_engine: Engine): void {
    this._turnlabel = new Label({
      x: this._game.drawWidth / 2,
      y: 50,
      text: "あなたの番です",
      font: new Font({
        size: 30,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
    });

    this._scorelabel = new Label({
      x: this._game.drawWidth / 2,
      y: 100,
      text: `あなたのスコア: 0  相手のスコア: 0`,
      font: new Font({
        size: 20,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
    });

    //大きな枠を生成する
    const frame = new Frame(
      this,
      vec(this._game.screen.center.x, this._game.screen.center.y + 50),
      this._blocksize * 10 + 20,
      this._blocksize * 20 + 20,
      10
    );

    //全体盤面の生成
    this._board = new Board(
      this,
      frame.innerpos_leftup,
      this._blocksize * 10,
      this._blocksize * 20,
      25
    );

    this.add(this._turnlabel);
    this.add(this._scorelabel);
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

    //タイトルに戻るイベント
    connection?.addSocketEvent("backToTitle", (data: any) => {
      this._board.resetBoard();
      this._currentMino?.kill();
      this._game.goToScene("title");
    });

    connection?.addSocketEvent("updateScore", (data: any) => {
      console.log(data);
      this.changeLabel(data.isturn, data.score);
    });
  }

  public onActivate(_context: SceneActivationContext<unknown>): void {
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
    if (_engine.input.keyboard.wasPressed(Input.Keys.D)) {
      this.MoveMino("right");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.A)) {
      this.MoveMino("left");
    }
    if (_engine.input.keyboard.wasPressed(Input.Keys.S)) {
      connection?.emitMessage("dropMino");
    }
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
      this._blocksize
    );
    this.add(this._currentMino);
  }

  public changeLabel(isturn: boolean, score: number[]) {
    if (isturn) {
      this._turnlabel.text = "あなたの番です";
    } else {
      this._turnlabel.text = "相手の番です";
    }
    this._scorelabel.text = `あなたのスコア: ${score[0]}  相手のスコア: ${score[1]}`;
  }

  public dissapearedLineAction(dissapeared_line: number[]) {}
}

export default PlayGame;
