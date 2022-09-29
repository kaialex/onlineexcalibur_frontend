import {
  Actor,
  BaseAlign,
  Color,
  Engine,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  Sprite,
  Text,
  TextAlign,
  vec,
  Vector,
} from "excalibur";
import textButton from "../objects/textButton";
import resources from "../objects/resouces";
import resizeSprite from "../util/resizeSprite";
import { connection } from "../api/socketConnection";
import Popup from "../objects/popup";

class Title extends Scene {
  private _game: Engine;

  private _bgSprite: Sprite;
  private _background!: Actor;
  private _title!: Label;
  private _button!: textButton;
  private _popUp!: Popup;

  constructor(game: Engine) {
    super();
    this._game = game;

    this._bgSprite = resources.titleBackground.toSprite();
  }

  public onInitialize(_engine: Engine): void {
    this._bgSprite.scale = resizeSprite(
      this._bgSprite,
      this._game.drawWidth,
      this._game.drawHeight
    );
    //背景画像
    this._background = new Actor({
      x: this._game.screen.center.x,
      y: this._game.screen.center.y,
    });
    this._background.graphics.use(this._bgSprite);

    //タイトルの表示
    this._title = new Label({
      x: this._game.drawWidth / 2,
      y: this._game.drawHeight / 2 - 100,
      text: "MULTI TETRIS",
      font: new Font({
        family: "impact",
        size: 70,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        color: Color.White,
      }),
    });

    //ボタンの表示
    this._button = new textButton({
      scene: this,
      pos: Vector.Zero,
      text: new Text({
        text: "START GAME",
        font: new Font({
          size: 20,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle,
        }),
      }),
      width: 200,
      clicked: () => {
        connection?.emitMessage("matching");
      },
      btnBackground: resources.BtnBackground.toSprite(),
      z: 1,
    });

    this._button.pos = vec(
      this._game.drawWidth / 2 - this._button.width / 2,
      this._game.drawHeight / 2 - this._button.height / 2
    );

    this.add(this._background);
    this.add(this._title);
    this.add(this._button);

    //イベント登録
    connection?.addSocketEvent("startGame", () => {
      this._popUp.changeText("マッチング相手が見つかりました!", 15);
      setTimeout(() => {
        this._popUp.kill();
        this._game.goToScene("playgame");
      }, 1000);
    });

    connection?.addSocketEvent("makePopup", (data: any) => {
      this._button.preventButtonEvent();
      if (this._popUp !== undefined) this._popUp.kill();
      this._popUp = new Popup({
        scene: this,
        pos: vec(this._game.drawWidth / 2, this._game.drawHeight / 2),
        width: 300,
        height: 200,
        text: data.message,
        buttontext: "OK",
        clicked: () => {
          setTimeout(() => {
            this._button.activateButtonEvent();
          }, 10);
        },
      });
      this._popUp.changeText(data.message, 15);
      this.add(this._popUp);
      console.log("makepopup");
    });

    connection?.addSocketEvent("waitMatching", (data: any) => {
      this._button.preventButtonEvent();
      if (this._popUp !== undefined) this._popUp.kill();
      this._popUp = new Popup({
        scene: this,
        pos: vec(this._game.drawWidth / 2, this._game.drawHeight / 2),
        width: 300,
        height: 200,
        text: "マッチング中...",
      });
      this._popUp.setHoppingAnimation();
      this.add(this._popUp);
    });
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {}

  public onDeactivate(_context: SceneActivationContext<undefined>): void {}
}

export default Title;
