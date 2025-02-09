import UserTokens from "#sequelize/models/userTokens.js";

export async function createToken(params) {
  return await UserTokens.create(params);
}

export async function getToken(params) {
  return await UserTokens.findOne({
    where: { ...params },
  });
}

export async function updateOrCreateToken(platformUid, params) {
  const userToken = await getToken({ platformUid });

  if (!userToken) {
    return await createToken({ ...params, platformUid });
  }

  Object.assign(userToken, params);
  await userToken.save();

  return userToken;
}
