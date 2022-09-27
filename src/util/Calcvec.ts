import { Sprite, Vector } from "excalibur";

/**
 * 画像のサイズを指定したwidthとheightに合わせるためのベクトルを返す(どちらかのみ指定の場合は縦横比は維持)
 * @param sprite
 * @param width
 * @param height
 * @returns
 */
const CalcVec = (sprite: Sprite, width?: number, height?: number): Vector => {
  if (sprite.width === (NaN || 0) || sprite.height === (NaN || 0))
    return new Vector(0.1, 0.1);
  if (width && height) {
    return new Vector(width / sprite.width, height / sprite.height);
  } else if (width && !height) {
    return new Vector(width / sprite.width, width / sprite.width);
  } else if (!width && height) {
    return new Vector(height / sprite.height, height / sprite.height);
  } else {
    return new Vector(1, 1);
  }
};

export default CalcVec;
