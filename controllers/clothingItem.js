const ClothingItem = require("../models/clothingItem");
const {
  ERROR_400_BAD_REQUEST,
  ERROR_403_FORBIDDEN,
  ERROR_404_NOT_FOUND,
  ERROR_500_DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id, likes })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(ERROR_400_BAD_REQUEST).send({
          message: err.message,
        });
      } else {
        res
          .status(ERROR_500_DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_500_DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(ERROR_403_FORBIDDEN)
          .send({ message: "You are not authorized to delete this item." });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(ERROR_404_NOT_FOUND).send({
          message:
            "There is no clothing item with the requested id, or the request was sent to a non-existent address",
        });
      } else if (err.name === "CastError") {
        res.status(ERROR_400_BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else {
        res.status(ERROR_500_DEFAULT_ERROR).send({
          message: "An error has occurred on the server.",
        });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(ERROR_404_NOT_FOUND).send({
          message:
            "There is no clothing item with the requested id, or the request was sent to a non-existent address",
        });
      } else if (err.name === "CastError") {
        res.status(ERROR_400_BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else {
        res.status(ERROR_500_DEFAULT_ERROR).send({
          message: "An error has occurred on the server.",
        });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(ERROR_404_NOT_FOUND).send({
          message:
            "There is no clothing item with the requested id, or the request was sent to a non-existent address",
        });
      } else if (err.name === "CastError") {
        res.status(ERROR_400_BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else {
        res.status(ERROR_500_DEFAULT_ERROR).send({
          message: "An error has occurred on the server.",
        });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
