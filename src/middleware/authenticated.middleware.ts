import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("No valid token provided.");
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("TokenID: ", idToken);
    console.log("Decoded token:", decodedToken);
    // Aqui você pode anexar o usuário ao objeto da requisição
    (req as any).user = decodedToken;
    return next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Invalid token.");
  }
}

export default authenticatedMiddleware;
