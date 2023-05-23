const express = require("express");
const userRouter = express.Router();
const UserModel = require("../Models/UsersModel");
// const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// userRouter.use(AuthenticationMiddleware)

userRouter.post("/signup", async (req, res) => {
  const { email, password, name, lastname, gender } = req.query;
  const regExp = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,8}/g;
  const userData = await UserModel.find({ email });

  try {
    if (userData.length > 0) {
      res.send("User already exists");
    } else {
      try {
        bcrypt.hash(password, 5, async (err, hashPass) => {
          const user = new UserModel({
            email,
            password: hashPass,
            name,
            lastname,
            gender,
          });
          await user.save();
          return res.status(201).send({ message: "Successfull" });
        });
      } catch (err) {
        return res.status(403).send({ message: "Registered failed" });
      }
    }
  } catch (err) {
    return res.status(403).send({ message: "404 error Url is not working" });
  }
});

module.exports = userRouter
