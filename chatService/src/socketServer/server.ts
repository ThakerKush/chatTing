import { app } from "../App";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { DB, RDB } from "../db/models/index";
import WebSocket, { WebSocketServer } from "ws";
import { serverService } from "../services/serverService";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

declare module "ws" {
  export interface WebSocket {
    AuthUser: number;
    channelId: string;
    server: string;
  }
}

const server = app.getServer();
console.log(server);

export const wss: WebSocketServer = new WebSocketServer({ noServer: true });
console.log("socket server started");
const connections: Map<string, Set<WebSocket>> = new Map();

const getChannelConnNums = () => {
  for (const key of connections.keys()) {
    console.log(`TOTAL_CONNS: {${key} : ${connections.get(key)!.size}} `);
  }
};

const broadcastMessageToChannel = (
  channelId: string,
  message: string,
  me: WebSocket
) => {
  const channelConns: Set<WebSocket> | undefined = connections.get(channelId);
  if (channelConns) {
    for (const ws of channelConns) {
      if (ws !== me) ws.send(message);
    }
  } else {
    console.log("for some reson channelConns is undefined");
  }
};

wss.on(
  "connection",
  async function (ws: WebSocket.WebSocket, req: IncomingMessage) {
    ws.on("error", console.error);

    const channelId = ws.channelId;

    if (connections.has(channelId)) {
      connections.get(channelId)!.add(ws);
    } else {
      const wsSet: Set<WebSocket> = new Set([ws]);
      connections.set(channelId, wsSet);
    }

    ws.on("close", function close() {
      console.log(`client ${ws.AuthUser} disconnected from ${ws.channelId}`);
      connections.get(channelId).delete(ws);
    });

    // wss1.clients.forEach(function each(client) {
    //   console.log(`New client ${client.AuthUser} connected to ${client.server}`);          Maybe I'll need this to see who's online....
    // });

    ws.on("message", function message(data: Buffer) {
      if (
        !String(data)
          .trim()
          .replace(/[\n\r]+ */g, " ")
      ) {
        ws.send("you cannot send an empty message");
      }
      RDB.xadd(
        "mystream",
        "*",
        "user",
        `${ws.AuthUser}`,
        "server",
        `${ws.server}`,
        "value",
        `${String(data).trim()}`,
        (err, id) => {
          if (err) {
            console.log(err);
          } else {
            console.log(id);
          }
        }
      );
      broadcastMessageToChannel(channelId, String(data), ws);
    });
  }
);

server.on("upgrade", async function upgrade(request, socket, head) {
  wss.handleUpgrade(
    request,
    socket,
    head,
    async function done(ws: WebSocket.WebSocket) {
      try {
        ws.channelId = request.url.substring(1); //Make not of this

        if (!uuidValidate(ws.channelId)) {
          ws.close(1007, "Invalid Server");
        }

        const serverId = await serverService.getServerId(ws.channelId);
        ws.server = serverId;
        const cookies = request.headers.cookie.split("; ");
        const authCookie = cookies.find((cookie) =>
          cookie.startsWith("Authorization=")
        );
        const token = authCookie ? authCookie.split("=")[1].slice(0, -1) : null;
        const decodedData = await jwt.verify(token, "somePrivateKey");
        const user = await DB.user.findByPk(decodedData.id);

        if (!user) {
          ws.close(1007, "User not found");
          throw new Error("User not found");
        }

        ws.AuthUser = user["id"];
        const exists = await serverService.checkUser({
          userId: ws.AuthUser,
          uuid: ws.channelId,
        });
        if (!exists) {
          ws.close(1007, "NotaPartOfServer");
        }
        wss.emit("connection", ws, request);
      } catch (error) {
        console.error("Error while upgrading connection", error);

        if (error["message"] === "jwt expired") {
          ws.close(1007, "JWT_EXPIRED");
        } else {
          console.log("[JWT_ERROR]:", error);

          ws.close(1007, "INVALID_JWT");
        }

        socket.destroy();
      }
    }
  );
});

setInterval(getChannelConnNums, 3000);
