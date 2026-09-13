const { z } = require("zod");

const createQuotationSchema = z.object({
  rfqId: z.coerce
    .number()
    .int()
    .positive("Invalid RFQ"),

  quotedPrice: z.coerce
    .number()
    .positive("Quoted price must be greater than 0"),

  estimatedDelivery: z
    .string()
    .trim()
    .min(1, "Estimated delivery time is required")
    .max(100),

  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default(""),
});

module.exports = {
  createQuotationSchema,
};