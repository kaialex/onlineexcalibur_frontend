import { Color } from "excalibur";

export type block = 0 | 1;
export type MinoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export interface MinoProps {
  name: string;
  blockdata: block[][];
  color: string;
}

export const colorPalatte: Color[] = [
  Color.Transparent,
  Color.fromHex("#00FFFF"),
  Color.fromHex("#FFFF00"),
  Color.fromHex("#FF00FF"),
  Color.fromHex("#00FF00"),
  Color.fromHex("#FF0000"),
  Color.fromHex("#0000FF"),
  Color.fromHex("#FFA500"),
];
