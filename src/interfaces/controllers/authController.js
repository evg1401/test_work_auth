import {
  refreshTokenService,
  signUpService,
  signInService,
  signOutService,
} from "#services/authService.js";
import { isValidTextField } from "#lib/helper.js";

export async function signInController(req, res) {
  try {
    const { email, password } = req.body;
    const platformUid = res?.locals.platformUid ?? null;

    if (!isValidTextField(email) || !isValidTextField(password)) {
      throw "пароль или email не могут быть пустыми";
    }

    const result = await signInService({ email, password, platformUid });

    res.send({ result });
  } catch (err) {
    res.status(400).json({ message: `Ошибка авторизации: ${err}` });
  }
}

export async function signOutController(_, res) {
  try {
    const platformUid = res?.locals.platformUid ?? null;

    if (!isValidTextField(platformUid)) {
      return res.send({ result: false });
    }

    const result = await signOutService(platformUid);
    res.send({ result });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

export async function signUpController(req, res) {
  try {
    const { email, password } = req.body;
    const platformUid = res?.locals.platformUid ?? null;

    if (!isValidTextField(email) || !isValidTextField(password)) {
      throw "пароль или email не могут быть пустыми";
    }

    const result = await signUpService({ email, password, platformUid });
    res.send({ result });
  } catch (err) {
    res.status(400).json({ message: `Ошибка регистрации: ${err}` });
  }
}

export async function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body;
    const platformUid = res?.locals.platformUid ?? null;

    if (!isValidTextField(platformUid) || !isValidTextField(refreshToken)) {
      throw "вы не авторизованы! Требуется авторизация.";
    }

    const result = await refreshTokenService({ refreshToken, platformUid });

    res.send({ result });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}
