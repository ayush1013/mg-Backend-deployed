const express = require("express");
const userRouter = express.Router();
const UserModel = require("../Models/UsersModel");
// const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// userRouter.use(AuthenticationMiddleware)

userRouter.post("/signup", async (req, res) => {
  const { email, password, name, lastname, gender } = req.body;
  const regExp = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,8}/g;
  const userData = await UserModel.find({ email });

  console.log("userData",userData);

  try {
    if (userData.length > 0) {
      return res.send({message : "User already exists"});
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

userRouter.post("/login", async(req,res)=>{
  const {email, password} = req.body;

  console.log(email, password);

  try {
    const user = await UserModel.find({email});
    if(user.length>0){
      bcrypt.compare(password, user[0].password, (err,result)=>{
        if(result){
          const token = jwt.sign({userID: user[0]._id}, process.env.key, {expiresIn:"24h"})
          return res.status(201).send({ message: "Login Successfull", token: token });
        }else{
          return res.status(403).send({ message: "Wrong password" });
        }
      } )
    }else{
      return res.status(403).send({ message: "User does not exist with this email" });
    }

  } catch (err) {
    console.log("err",err)
    return res.status(403).send({ message: "Wrong email or password" });
  }

})

module.exports = userRouter
