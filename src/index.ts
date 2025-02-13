import "dotenv/config";
import "module-alias/register";
import validateEnv from "@/utils/validateEnv";
import App from "./app";
import TestController from "./resources/test/test.controller";
import * as admin from "firebase-admin";
import serviceAccount from "@/config/firebase-admin-config.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://nerdboard-956ae-default-rtdb.firebaseio.com/", // Atualize com sua URL do Firebase
});

validateEnv();

const db = admin.database()

const app = new App([new TestController()], db, Number(process.env.PORT));

app.listen();

export default admin