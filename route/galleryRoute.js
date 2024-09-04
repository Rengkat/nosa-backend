const {
  addToGallery,
  updateGallery,
  removeFromGallery,
  getAllGalleryImages,
  getSingleGalleryImage,
} = require("../controllers/galleryController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addToGallery)
  .get(getAllGalleryImages);
router
  .route("/:id")
  .get(getSingleGalleryImage)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateGallery)
  .delete([authenticateUser, superAdminAuthorizationPermission], removeFromGallery);
module.exports = router;
