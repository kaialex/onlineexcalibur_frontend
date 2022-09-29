import {
  ActionContext,
  Actor,
  BaseAlign,
  Color,
  EasingFunctions,
  Font,
  Label,
  Scene,
  Text,
  TextAlign,
  vec,
  Vector,
} from "excalibur";
import Resources from "./resouces";
import TextButton from "./textButton";

interface PopupProps {
  scene: Scene;
  pos: Vector;
  width: number;
  height: number;
  text: string;
  clicked?: () => void;
  buttontext?: string;
}

class Popup extends Actor {
  private _scene: Scene;
  private _label: Label;
  private _button?: TextButton;

  constructor(data: PopupProps) {
    const { scene, pos, width, height, text, clicked, buttontext } = data;

    super({
      name: "card",
      pos: pos,
      width: width,
      height: height,
      color: Color.Gray,
      z: 1000,
    });

    this._scene = scene;

    this._label = new Label({
      text: text,
      font: new Font({
        size: 30,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
      pos: vec(pos.x, pos.y - height / 4),
      width: width,
      height: height,
      color: Color.White,
      z: 1001,
    });

    //クリックボタンの配置
    if (buttontext === undefined) return;
    console.log("aaa");
    this._button = new TextButton({
      scene: scene,
      pos: vec(pos.x, pos.y),
      text: new Text({
        text: buttontext ?? "OK",
        font: new Font({
          size: 20,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle,
        }),
      }),
      height: 100,
      clicked: () => {
        if (clicked !== undefined) clicked();
        this.kill();
      },
      btnBackground: Resources.BtnBackground.toSprite(),
      z: 1001,
    });
    console.log(this._button.pos);
    this._button.pos = vec(
      this._button.pos.x - this._button.width / 2,
      this._button.pos.y
    );
  }

  onInitialize(): void {
    this._scene.add(this._label);
    if (this._button !== undefined) this._scene.add(this._button);
  }

  setHoppingAnimation(): void {
    this._label.actions.repeat((repeatCtx) => {
      repeatCtx.easeBy(0, -10, 1000, EasingFunctions.EaseOutCubic);
      repeatCtx.easeBy(0, 10, 1000, EasingFunctions.EaseInCubic);
    });
  }

  changeText(text: string, size: number): void {
    this._label.text = text;
    this._label.font.size = size;
  }

  kill(): void {
    this._label.kill();
    if (this._button !== undefined) this._button.kill();
    super.kill();
  }
}

export default Popup;
