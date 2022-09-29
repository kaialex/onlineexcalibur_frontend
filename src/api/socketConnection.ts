import { io } from "socket.io-client";

class socketConnection {
  private ENDPOINT: string;
  private socket;

  constructor(path: string) {
    this.ENDPOINT = path;
    this.socket = io(this.ENDPOINT, { autoConnect: false });
  }

  //ソケットの初期登録
  init() {
    this.socket.open();
    this.socket.on("updateConnectionCount", (data) => {
      const { newConnectCount }: { newConnectCount: number } = data;
    });
  }

  //ソケットのイベント登録
  addSocketEvent(message: string, callback: (data: any) => void) {
    this.socket.on(message, callback);
  }

  //ソケットのメッセージ発信
  emitMessage(message: string, data?: any) {
    this.socket.emit(message, data);
  }
}

export let connection: socketConnection | undefined = undefined;

export const makeConnection = () => {
  //ソケット通信の設定
  //本番環境ではherokuのURLを指定する
  const ENDPOINT: string = "https://kaialex22-excalibur.herokuapp.com/";
  //const ENDPOINT: string = "http://localhost:8080";
  connection = new socketConnection(ENDPOINT);
  connection.init();
};
