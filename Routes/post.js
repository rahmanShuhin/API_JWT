const router = require("express").Router();
const verify = require("../verifyToken");
const User = require("../Model/User");
router.get("/", verify, (req, res) => {
  res.json({ post: { title: "my first post" } });
  User.findOne({ _id: req.user });
});

module.exports = router;
