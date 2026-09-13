const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const {
  createQuotationSchema,
} = require("../validators/quotationValidator");

const {
  createQuotation,
  getMyQuotations,
  getQuotationsForRfq,
} = require("../controllers/quotationController");

const router = express.Router();

router.use(authenticate);

// Supplier
router.post(
  "/",
  authorize("SUPPLIER"),
  validate(createQuotationSchema),
  createQuotation
);

router.get(
  "/my",
  authorize("SUPPLIER"),
  getMyQuotations
);

// Buyer
router.get(
  "/rfq/:rfqId",
  authorize("BUYER"),
  getQuotationsForRfq
);

module.exports = router;