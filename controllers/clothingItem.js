const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  DEFAULT_ERROR,
  FORBIDDEN,
  NOT_FOUND,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid data",
        });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server. [C001]" });
      }
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server. [C002]"  });
    });
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        res
          .status(FORBIDDEN)
          .send({ message: "Not authorized to delete this item." });
      } else {
        res.send({ message: "Item has been deleted." });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({message: "Id not found, or the request was sent to a non-existent address",});
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid id.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({
          message: "An error has occurred on the server. [C003]",
        });
      }
    });
};

const likeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((like) => res.send({ like }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message:
            "There is no clothing item with the requested ID, or the request was sent to a non-existent address.",
        });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({
          message: "An error has occurred on the server. [C004]",
        });
      }
    });

const dislikeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message:
            "There is no clothing item with the requested ID, or the request was sent to a non-existent address.",
        });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID.",
        });
      } else {
        res.status(DEFAULT_ERROR).send({
          message: "An error has occurred on the server. [C005]",
        });
      }
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
