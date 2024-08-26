const express = require("express");
const { getAllUsers, getSingleUser } = require("../controllers/userController");
// const { authenticateUser, authorizationPermission } = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllUsers);
router.route("/:userId").get(getSingleUser);
module.exports = router;
