export default (req, res, next) => {
  const platformUidHeader = req.get("Application-sid");
  res.locals.platformUid = platformUidHeader || null;

  return next();
};
