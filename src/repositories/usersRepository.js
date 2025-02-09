import User from "#sequelize/models/users.js";

export async function createUser(params) {
  const user = await getUser({ email: params.email });
  if (user) {
    throw "пользователь с таким email уже существует";
  }

  return await User.create(params);
}

export async function getUser(params) {
  const user = await User.findOne({
    where: { ...params },
  });

  return user;
}

export async function updateUser(email, params) {
  const user = await getUser({ email });

  if (!user) {
    throw "Пользователь не найден";
  }

  Object.assign(user, params);
  await user.save();

  return user;
}
