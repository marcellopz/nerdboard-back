import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer, Server as HTTPServer } from "http";
import Controller from "./utils/interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import { Server, Socket } from "socket.io";
import socketAuthMiddleware from "./middleware/socketAuthMiddleware";
import roomManager from "services/roomManager";
import RoomManager from "services/roomManager";
import UserManager from "services/userManager";
import { Database } from "firebase-admin/lib/database/database";
import BackServer from "./services/server";

export const allowedOrigins = ["http://localhost:5173"]; // Add other origins as needed

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  credentials: true,
};

class App {
  public express: Application;
  public port: number;
  public httpServer: HTTPServer;
  public io : Server
  public server : BackServer

  constructor(controllers: Controller[], db: Database, port: number) {
    this.express = express();
    this.port = port;
    this.httpServer = createServer(this.express);
    this.io = new Server(this.httpServer)
    this.initializeDatabaseConnection(db);
    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    // Error handling middleware should be loaded after the loading the controllers
    this.initializeErrorHandling();

    this.server = new BackServer(this.io, db)

    this.io.on("connection", (socket:Socket) => {
      this.server.setupNewSocket(socket)
    })
  }

  private initializeMiddlewares(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(compression());
    this.express.use(cors(corsOptions));
    this.express.use(helmet());
    this.express.use(morgan("dev"));
    this.express.use(cookieParser());
    this.io.use(socketAuthMiddleware)
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use("/api", controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  private initializeDatabaseConnection(db: Database): void {
    db.ref(".info/connected").on("value", (snapshot) => {
      if (snapshot.val() === true) {
        console.log("Conectado ao Firebase Realtime Database");
      } else {
        console.log("Desconectado do Firebase Realtime Database");
      }
    });
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log(
        `Server running on port ${this.port} - render: ${process.env.RENDER}`
      );
    });
  }
}

export default App;
