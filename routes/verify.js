const jwt = require("jsonwebtoken");

const verify = (request, result, next) => {
  const token = request.header("AuthToken");
  if (!token)
    return result.status(400).json({
      error: "Access denied",
    });

  try {
    const isVerified = jwt.verify(token, process.env.SECRET_TOKEN);

    request.user = isVerified;
    next();
  } catch (error) {
    result.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verify;
