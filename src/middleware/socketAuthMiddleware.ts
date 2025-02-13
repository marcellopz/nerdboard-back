import admin from "../index"; // Importe o Firebase Admin SDK corretamente
import { Socket } from "socket.io";

export default async (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.headers.authorization;
  if (!token) {
    return next(new Error("Token de autenticação ausente"));
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.data.user = { id: decodedToken.uid, name: decodedToken.name || "Usuário", email: decodedToken.email };
    next(); // Continua para o próximo middleware ou handler
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    next(new Error("Token inválido"));
  }
};