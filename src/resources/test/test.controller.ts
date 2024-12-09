import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import authenticated from "@/middleware/authenticated.middleware";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

class TestController implements Controller {
  public path = "/test";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, authenticated, this.getTest); // Add the authenticated middleware here
  }

  private getTest = (req: Request, res: Response): void => {
    const user = req.user as DecodedIdToken; // req.user is available because of the authenticated middleware
    console.log("user", user.email);
    res.status(200).json({ message: "Hello World" });
  };
}

export default TestController;
