const express = require("express");
const { getAllUsers, getSingleUser, deleteUser } = require("../controllers/userController");
// const { authenticateUser, authorizationPermission } = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllUsers);
router.route("/:userId").get(getSingleUser).delete(deleteUser);
module.exports = router;
