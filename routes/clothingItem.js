const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", auth, createItem);
//router.post("/", createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, likeItem);
//router.put("/:itemId/likes", likeItem);

router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, dislikeItem);
//router.delete("/:itemId", deleteItem);
//router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
