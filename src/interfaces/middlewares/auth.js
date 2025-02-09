import jwt from "jsonwebtoken";
import { isTokenExpired } from "#lib/helper.js";

export default (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw "вы не авторизованы";
    }

    const token = authHeader.replace("Bearer", "").trim();
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (!payload || isTokenExpired(payload.exp)) {
      throw "требуется авторизация";
    }

    res.locals.user = {
      email: payload.email,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};
