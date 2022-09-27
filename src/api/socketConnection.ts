import { io } from "socket.io-client";

class socketConnection {
  private ENDPOINT: string;
  private socket;

  constructor(path: string) {
    this.ENDPOINT = path;
    this.socket = io(this.ENDPOINT);
  }

  init() {
    this.socket.on("updateConnectionCount", (data) => {
      const { newConnectCount }: { newConnectCount: number } = data;
      console.log(newConnectCount);
      this.socket.emit("okok", { ok: "ok" });
    });
  }
}

export default socketConnection;
