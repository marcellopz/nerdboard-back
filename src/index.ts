import "dotenv/config";
import "module-alias/register";
import validateEnv from "@/utils/validateEnv";
import App from "./app";
import TestController from "./resources/test/test.controller";
import ChatController from "./resources/test/chat.controller";
import * as admin from "firebase-admin";
import serviceAccount from "@/config/firebase-admin-config.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

validateEnv();

const app = new App([new TestController(), new ChatController()], Number(process.env.PORT));

app.listen();
