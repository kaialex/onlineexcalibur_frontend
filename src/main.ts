import { DisplayMode, Engine, Loader } from "excalibur";
import socketConnection from "./api/socketConnection";
import Resources from "./objects/resouces";
import PlayGame from "./scene/playGame";
import Title from "./scene/title";

//ソケット通信の設定
const ENDPOINT: string = "http://localhost:8080";
const connection = new socketConnection(ENDPOINT);
connection.init();

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
