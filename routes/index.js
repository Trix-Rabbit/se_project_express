const router = require("express").Router();
const clothingItemRoutes = require("./clothingItem");
const userRoutes = require("./users");
const { createUser, userLogin } = require("../controllers/users");
const { ERROR_404_NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItemRoutes);
router.use("/users", userRoutes);

router.post("/signup/", createUser);
router.post("/signin/", userLogin);

router.use((req, res) => {
  console.log(res);
  res.status(ERROR_404_NOT_FOUND).send({
    message: "The request was sent to a non-existent address",
  });
});

module.exports = router;
