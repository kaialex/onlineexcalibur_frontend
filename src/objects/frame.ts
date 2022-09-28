import { Actor, Canvas, Color, Scene, vec, Vector } from "excalibur";

class Frame extends Actor {
  private _inner: Actor;
  private _scene: Scene;

  constructor(
    scene: Scene,
    pos: Vector,
    width: number,
    height: number,
    padding: number
  ) {
    super({
      name: "frame",
      pos: pos,
      width: width,
      height: height,
      color: Color.Black,
    });

    this._inner = new Actor({
      pos: vec(pos.x, pos.y),
      width: width - padding * 2,
      height: height - padding * 2,
      color: Color.White,
      z: 1,
    });

    this._scene = scene;
  }

  onInitialize(): void {
    this._scene.add(this._inner);
  }

  get innerpos_leftup(): Vector {
    return vec(
      this._inner.pos.x - this._inner.width / 2,
      this._inner.pos.y - this._inner.height / 2
    );
  }
}

export default Frame;
