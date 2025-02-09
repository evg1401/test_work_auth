import jwt from "jsonwebtoken";
import { scryptSync } from "crypto";
import { usersRepository, userTokensRepository } from "#repositories";
import { isTokenExpired } from "#lib/helper.js";

export async function signInService({ email, password, platformUid }) {
  const user = await usersRepository.getUser({ email });

  if (!user) {
    throw "пользователь не найден.";
  }
  if (!_veryfyPassword(user.password, password)) {
    throw "пароль неверный.";
  }

  return await _generateTokensForUser(user, { email, platformUid });
}

export async function signUpService(params) {
  const newUser = await usersRepository.createUser(params);
  await userTokensRepository.createToken({
    userId: newUser.id,
    platformUid: params.platformUid,
  });

  return newUser;
}

export async function signOutService(platformUid) {
  const userToken = await userTokensRepository.getToken({ platformUid });

  if (userToken?.tokenId) {
    const result = await userTokensRepository.updateOrCreateToken(platformUid, {
      tokenId: null,
    });

    return !!result;
  }

  return false;
}

export async function refreshTokenService({ refreshToken, platformUid }) {
  const payload = jwt.verify(refreshToken.trim(), process.env.JWT_TOKEN_SECRET);

  if (isTokenExpired(payload.exp)) {
    throw "вы не авторизованы! Требуется авторизация.";
  }

  return await _refreshAccessToken(
    { email: payload.email },
    { refreshToken, platformUid }
  );
}

async function _generateTokensForUser(user, { email, platformUid }) {
  const tokens = {};

  const userToken = await userTokensRepository.getToken({
    userId: user.id,
    platformUid,
  });

  if (!userToken?.tokenId) {
    return await _createAndStoreTokens(tokens, {
      email,
      platformUid,
      userId: user.id,
    });
  }

  const decoded = jwt.decode(userToken.tokenId);

  if (!decoded || email !== decoded.email) {
    throw "Доступ запрещен. Требуется авторизация.";
  }

  if (isTokenExpired(decoded.exp)) {
    return await _createAndStoreTokens(tokens, {
      email,
      platformUid,
      userId: user.id,
    });
  }

  const accessToken = _createToken(
    { email: decoded.email },
    process.env.JWT_TOKEN_ACCESS_LIFETIME
  );
  Object.assign(tokens, { accessToken, refreshToken: userToken.tokenId });

  return tokens;
}

async function _createAndStoreTokens(tokens, { email, platformUid, userId }) {
  Object.assign(tokens, _generateTokens({ email }));

  await userTokensRepository.updateOrCreateToken(platformUid, {
    tokenId: tokens.refreshToken,
    userId,
  });

  return tokens;
}

function _generateTokens(payload) {
  const accessToken = _createToken(
    { ...payload },
    process.env.JWT_TOKEN_ACCESS_LIFETIME
  );
  const refreshToken = _createToken(
    { ...payload },
    process.env.JWT_TOKEN_REFRESH_LIFETIME
  );

  return { accessToken, refreshToken };
}

async function _refreshAccessToken(payload, { refreshToken, platformUid }) {
  const user = await usersRepository.getUser({
    ...payload,
  });

  if (!user) {
    throw "вы не авторизованы! Требуется авторизация.";
  }

  const userToken = await userTokensRepository.getToken({
    userId: user.id,
    platformUid,
  });

  if (!userToken?.tokenId || refreshToken.trim() !== userToken.tokenId) {
    throw "вы не авторизованы! Требуется авторизация.";
  }

  const accessToken = _createToken(
    { ...payload },
    process.env.JWT_TOKEN_ACCESS_LIFETIME
  );

  return { accessToken, refreshToken };
}

function _veryfyPassword(password, password_2) {
  const rsPassword = scryptSync(
    password_2,
    process.env.JWT_TOKEN_SALT,
    64
  ).toString("hex");

  return String(password) === String(rsPassword);
}

function _createToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn,
  });
}
