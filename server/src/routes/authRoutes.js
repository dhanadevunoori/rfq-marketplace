const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const validate = require("../middleware/validate");
const authenticate = require("../middleware/authMiddleware");

const {
  signupSchema,
  loginSchema,
} = require("../validators/authValidator");

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  signup
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
    "/me", 
    authenticate, 
    getMe
);

module.exports = router;