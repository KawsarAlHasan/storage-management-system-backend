const jwt = require("jsonwebtoken");

exports.generateLockedToken = (data) => {
  const payload = {
    id: data._id,
    user: data.user,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30days",
  });

  return token;
};
