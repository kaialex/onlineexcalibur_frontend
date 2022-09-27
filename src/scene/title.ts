import {
  Actor,
  BaseAlign,
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

class Title extends Scene {
  private _game: Engine;

  private _bg: Sprite;

  constructor(game: Engine) {
    super();
    this._game = game;

    this._bg = resources.titleBackground.toSprite();
  }

  public onInitialize(_engine: Engine): void {
    this._bg.scale = resizeSprite(
      this._bg,
      this._game.drawWidth,
      this._game.drawHeight
    );
    //背景画像
    const background = new Actor({
      x: this._bg.width / 2,
      y: this._bg.height / 2,
    });
    background.graphics.use(this._bg);

    //タイトルの表示
    const title = new Label({
      x: this._game.drawWidth / 2,
      y: this._game.drawHeight / 2 - 100,
      text: "HALLO",
      font: new Font({
        family: "impact",
        size: 100,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
    });

    //ボタンの表示
    const button = new textButton({
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
        this._game.goToScene("playgame");
        alert("I've been clicked");
      },
      btnBackground: resources.BtnBackground.toSprite(),
    });

    button.pos = vec(
      this._game.drawWidth / 2 - button.width / 2,
      this._game.drawHeight / 2 - button.height / 2
    );

    this.add(background);
    this.add(title);
    this.add(button);
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {}

  public onDeactivate(_context: SceneActivationContext<undefined>): void {
    //this._button.kill();
  }
}

export default Title;
