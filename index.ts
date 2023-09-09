import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prev: Point;
  curr: Point;
  color: string;
};

io.on("connection", (socket) => {
  console.log("socket.io connection");

  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", ({ prev, curr, color }: DrawLine) => {
    socket.broadcast.emit("draw-line", { prev, curr, color });
  });

  socket.on("clear", () => io.emit("clear"));
});

server.listen(3001, () => {
  console.log("✔️ Server listening on port 3001");
});
