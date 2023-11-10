const User = require("../models/user");
const { BAD_REQUEST, DEFAULT_ERROR, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res) => {
  User
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error has occurred on the server. [U001]" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({message: "Id not found, or the request was sent to a non-existent address",});
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid user Id.",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Error has occurred on the server.  [U002]" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User
    .create({ name, avatar })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "invalid data",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Error has occurred on the server.  [U003]" });
      }
    });
};
module.exports = { getUser, getUsers, createUser };
