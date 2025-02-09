import { Router } from "express";
import {
  signInController,
  signUpController,
  signOutController,
  refreshTokenController,
} from "#controllers/authController.js";
import platformUidMiddleware from "#middlewares/platformUid.js";

export default new Router()
  .post("/signin", platformUidMiddleware, signInController)
  .post("/signup", platformUidMiddleware, signUpController)
  .post("/logout", platformUidMiddleware, signOutController)
  .post("/refresh", platformUidMiddleware, refreshTokenController);
