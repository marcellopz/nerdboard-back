import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*", // Defina conforme necessário
  },
});

// Namespace para o chat global
const chatNamespace = io.of("/chat");
chatNamespace.on("connection", (socket) => {
  console.log(`Usuário conectado ao chat: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} entrou na sala ${room} no chat`);
  });

  socket.on("message", (data) => {
    chatNamespace.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Usuário ${socket.id} desconectou do chat`);
  });
});

// Namespace para os jogos
const gamesNamespace = io.of("/games");
gamesNamespace.on("connection", (socket) => {
  console.log(`Usuário conectado aos jogos: ${socket.id}`);

  socket.on("joinGameRoom", ({ gameType, roomId }) => {
    const roomName = `${gameType}:${roomId}`;
    socket.join(roomName);
    console.log(`${socket.id} entrou na sala ${roomName}`);
  });

  socket.on("gameEvent", ({ gameType, roomId, event }) => {
    const roomName = `${gameType}:${roomId}`;
    gamesNamespace.to(roomName).emit("gameEvent", event);
  });

  socket.on("disconnect", () => {
    console.log(`Usuário ${socket.id} desconectou dos jogos`);
  });
});
