const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);
// Sprint 12
//router.get("/", getCurrentUser);
//router.get("/:userId", getUser); 
//router.post("/", updateUsers);

module.exports = router;

