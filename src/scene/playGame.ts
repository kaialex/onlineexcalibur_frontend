import {
  BaseAlign,
  Engine,
  Font,
  Scene,
  Text,
  TextAlign,
  vec,
  Vector,
} from "excalibur";
import TextButton from "../objects/textButton";
import resources from "../objects/resouces";

class PlayGame extends Scene {
  private _game: Engine;

  constructor(game: Engine) {
    super();
    this._game = game;
  }

  public onInitialize(_engine: Engine): void {
    //ボタンの表示
    const button = new TextButton({
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
        this._game.goToScene("title");
        //alert("I've been clicked");
      },
      btnBackground: resources.BtnBackground.toSprite(),
    });
    button.pos = vec(
      this._game.drawWidth / 2 - button.width / 2,
      this._game.drawHeight - 100
    );

    this.add(button);
  }
}

export default PlayGame;
