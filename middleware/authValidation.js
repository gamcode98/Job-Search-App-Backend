const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./../config");

const authValidation = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (bearer && bearer.startsWith("Bearer")) {
    const [, token] = bearer.split("Bearer ");
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;

        return next();
      } catch ({ message, name }) {
        return res.status(403).json({
          error: true,
          message,
          type: name,
        });
      }
    }
  }

  return res.status(403).json({
    error: true,
    message: "Insufficient permissions",
  });
};

const checkRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      return next();
    } else {
      return res.json({
        error: true,
        message: "Insufficient permissions",
      });
    }
  };
};

module.exports = { authValidation, checkRoles };
