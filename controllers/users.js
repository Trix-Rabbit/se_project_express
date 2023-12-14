const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  handleErrors,
  ERROR_400_BAD_REQUEST,
  ERROR_409_DUPLICATE,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(ERROR_400_BAD_REQUEST).send({ message: "No user found" });
  }
  return User.findOne({ email }).then((userFound) => {
    if (userFound) {
      return res
        .status(ERROR_409_DUPLICATE)
        .send({ message: "That email already exists" });
    }

    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((user) =>
            res.send({
              name,
              avatar,
              email,
              _id: user._id,
            }),
          )
          .catch((err) => {
            console.error(err);
            handleErrors(req, res, err);
          });
      })
      .catch((err) => {
        console.error(err);
        handleErrors(req, res, err);
      });
  });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(ERROR_400_BAD_REQUEST).send({ message: "Incorrect email or password" });
    });
};


const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      handleErrors(req, res, err);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      handleErrors(req, res, err);
    });
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateUser,
};
