const router = require("express").Router();
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const { registrationValidation, loginValidation } = require("../Validation");
//validation
const joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  //authentication
  const { error } = registrationValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }
  //check if user is already in database
  const existUser = await User.findOne({ email: req.body.email });
  console.log(existUser);
  if (existUser) return res.status(400).send("Email is already exist");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashPassword);
  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveduser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }
  const existUser = await User.findOne({ email: req.body.email });
  if (!existUser) return res.status(400).send("Email is not found");
  const validPass = await bcrypt.compare(req.body.password, existUser.password);
  if (!validPass) return res.status(400).send("Invalid Password");
  //create and assign a token
  const token = jwt.sign({ _id: existUser._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
