import {
  Font,
  Label,
  Scene,
  ScreenElement,
  Sprite,
  SpriteFont,
  Text,
  vec,
  Vector,
} from "excalibur";
import resizeSprite from "../util/resizeSprite";
import Resources from "./resouces";

interface TextButtonProps {
  scene: Scene;
  pos: Vector;
  text?: Text;
  width?: number;
  height?: number;
  clicked?: () => void;
  btnBackground: Sprite;
  btnHovered?: Sprite;
  z: number;
}

class TextButton extends ScreenElement {
  private _btnBackground: Sprite;
  private _btnHovered: Sprite;
  private _text: Label;
  private _width: number;
  private _height: number;
  private _clicked: (() => void) | undefined;

  constructor(props: TextButtonProps) {
    const {
      scene,
      pos,
      text,
      width,
      height,
      clicked,
      btnBackground,
      btnHovered,
      z,
    } = props;

    const _vec = resizeSprite(btnBackground, width, height);
    const _width = Resources.BtnBackground.width * _vec.x;
    const _height = Resources.BtnBackground.height * _vec.y;

    super({
      pos: pos,
      width: _width,
      height: _height,
      z: z,
    });

    this._btnBackground = btnBackground;
    this._btnHovered = btnHovered ?? btnBackground;

    this._btnBackground.scale = _vec;
    this._btnHovered.scale = _vec;

    this._width = _width;
    this._height = _height;
    this._clicked = clicked;

    this._text = new Label({
      x: pos.x + this._width / 2,
      y: pos.y + this._height / 2,
      text: text ? text.text : "",
      font: text?.font instanceof Font ? text.font : undefined,
      spriteFont: text?.font instanceof SpriteFont ? text.font : undefined,
      z: z + 1,
    });

    scene.add(this._text);
  }

  onInitialize() {
    this.graphics.add("idle", this._btnBackground);
    this.graphics.add("hover", this._btnHovered);

    this.graphics.show("idle");

    this.activateButtonEvent();
  }

  set pos(thepos: Vector) {
    super.pos = thepos;
    if (this._text !== undefined) {
      this._text.pos = vec(
        thepos.x + this._width / 2,
        thepos.y + this._height / 2
      );
    }
  }

  get pos() {
    return super.pos;
  }

  kill() {
    this._text.kill();
    super.kill();
  }

  public preventButtonEvent() {
    this.off("pointerup");
    this.off("pointerenter");
    this.off("pointerleave");
  }

  public activateButtonEvent() {
    this.on("pointerup", () => {
      if (this._clicked !== undefined) {
        this._clicked();
      }
    });
    this.on("pointerenter", () => {
      this.graphics.hide("idle");
      this.graphics.show("hover");
    });

    this.on("pointerleave", () => {
      this.graphics.hide("hover");
      this.graphics.show("idle");
    });
  }

  public Deactivate() {}
}

export default TextButton;
