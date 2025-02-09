import { Router } from "express";
import { infoController } from "#controllers/infoController.js";
import platformUidMiddleware from "#middlewares/platformUid.js";
import auth from "#middlewares/auth.js";

export default new Router().get(
  "/",
  platformUidMiddleware,
  auth,
  infoController
);
