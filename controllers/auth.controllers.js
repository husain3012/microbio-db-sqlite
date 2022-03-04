const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { nanoid } = require("nanoid");


exports.signup = async (req, res) => {
  const { username, password, level } = req.body;
  try {
    const newUser = await User.create({ username, password, level, user_id: nanoid() });
    return res.json({
      status: true,
      message: "User created successfully!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      error: "Some Error Occurred",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  // check if user exist
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({
        status: false,
        error: "User does not exist",
      });
    }
    // check if password is correct
    if (user.password !== password) {
      return res.status(400).json({
        status: false,
        error: "Username and password do not match.",
      });
    }
    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET||"youhaveeveryrighttobeangrybutthatdoesnotgiveyoutherighttobemean", { expiresIn: "1d" });
    return res.json({
      status: true,
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: false,
      error: "Some Error Occurred",
    });
  }
};

// exports.signout = (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/login");
// };
