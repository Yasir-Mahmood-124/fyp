const { registerUser, loginUser } = require("../Controllers/userController");
const {
  registerUserMiddleware,
  loginUserMiddleware,
} = require("../Middleware/userMiddleware");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/signup", registerUserMiddleware, registerUser);
userRouter.post("/signin", loginUserMiddleware, loginUser);

module.exports = userRouter;
