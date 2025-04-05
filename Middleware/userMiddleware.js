const Joi = require("joi");
const jwt = require("jsonwebtoken");

//  Joi Schema for Register Validation
const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.base": "Full Name must be a string.",
    "string.min": "Full Name must be at least 3 characters long.",
    "any.required": "Full Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long.",
    "any.required": "Password is required.",
  }),
});

//  Joi Schema for Login Validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

//  Middleware for Register Validation
const registerUserMiddleware = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      success: false,
      errors: error.details.map((err) => err.message), // Extract detailed errors
    });
  }

  next(); // Proceed to the controller
};

//  Middleware for Login Validation
const loginUserMiddleware = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      success: false,
      errors: error.details.map((err) => err.message), // Extract detailed errors
    });
  }

  next(); // Proceed to the controller
};


const authMiddleware = (req, res, next) => {
  // Check if token exists in request header (Authorization Bearer token)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
      return res.status(403).json({ message: "No token provided." });
  }

  // Verify token using your JWT secret (make sure to replace 'your_jwt_secret' with the actual secret)
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Attach the decoded user info to the request object (user.id, for example)
      req.user = decoded;
      next(); // Proceed to the next middleware/route handler
  });
};

module.exports = { registerUserMiddleware, loginUserMiddleware, authMiddleware };
