const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const {
  createRfqSchema,
} = require("../validators/rfqValidator");

const {
  createRfq,
  getMyRfqs,
  getRfqById,
  updateRfq,
  closeRfq,
  getAvailableRfqs,
  getAvailableRfqById,
} = require("../controllers/rfqController");

const router = express.Router();

router.use(authenticate);

// Supplier routes
router.get(
  "/",
  authorize("SUPPLIER"),
  getAvailableRfqs
);

router.get(
  "/available/:id",
  authorize("SUPPLIER"),
  getAvailableRfqById
);

// Buyer routes
router.post(
  "/",
  authorize("BUYER"),
  validate(createRfqSchema),
  createRfq
);

router.get(
  "/my",
  authorize("BUYER"),
  getMyRfqs
);

router.get(
  "/my/:id",
  authorize("BUYER"),
  getRfqById
);

router.put(
  "/my/:id",
  authorize("BUYER"),
  validate(createRfqSchema),
  updateRfq
);

router.patch(
  "/my/:id/close",
  authorize("BUYER"),
  closeRfq
);

module.exports = router;