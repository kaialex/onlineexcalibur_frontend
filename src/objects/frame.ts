import { Actor, Canvas, Color, Line, Scene, vec, Vector } from "excalibur";

class Frame extends Actor {
  private _inner: Actor;
  private _line: Actor;
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
      pos: pos,
      width: width - padding * 2,
      height: height - padding * 2,
      color: Color.White,
      z: 1,
    });

    this._line = new Actor({
      name: "line",
      pos: this.innerpos_leftup,
      z: 1,
    });

    this._line.graphics.anchor = Vector.Zero;
    this._line.graphics.use(
      new Line({
        start: vec(0, 100),
        end: vec(this._inner.width, 100),
        color: Color.Red,
        thickness: 5,
      })
    );

    this._scene = scene;
  }

  onInitialize(): void {
    this._scene.add(this._inner);
    this._scene.add(this._line);
  }

  get innerpos_leftup(): Vector {
    return vec(
      this._inner.pos.x - this._inner.width / 2,
      this._inner.pos.y - this._inner.height / 2
    );
  }

  kill(): void {
    this._line.kill();
    this._inner.kill();
    super.kill();
  }
}

export default Frame;
