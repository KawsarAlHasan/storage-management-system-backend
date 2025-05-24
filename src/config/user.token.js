const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30days",
  });

  return token;
};
