import { DisplayMode, Engine, Loader } from "excalibur";
import { makeConnection } from "./api/socketConnection";
import Resources from "./objects/resouces";
import PlayGame from "./scene/playGame";
import Title from "./scene/title";

//コネクション生成
makeConnection();

//エンジンの作成
const game = new Engine({
  width: 400,
  height: 700,
  displayMode: DisplayMode.Fixed,
  canvasElementId: "game",
});

//シーンの作成
const title = new Title(game);
game.add("title", title);
const playgame = new PlayGame(game);
game.add("playgame", playgame);
//game.backgroundColor = Color.Transparent;

//リソースの読み込み
const loader = new Loader(Object.values(Resources));

//ゲームスタート
game.start(loader).then(() => {
  game.goToScene("title");
});
