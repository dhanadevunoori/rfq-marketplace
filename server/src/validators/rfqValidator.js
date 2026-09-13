const { z } = require("zod");

const createRfqSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, "Product or service name is required")
    .max(255),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  quantity: z.coerce
  .number()
  .int()
  .positive("Quantity must be greater than 0"),

  deliveryLocation: z
    .string()
    .trim()
    .min(2, "Delivery location is required")
    .max(255),

  deadline: z
    .string()
    .datetime({
      message: "Invalid deadline",
    })
    .refine(
      (value) => new Date(value) > new Date(),
      "Deadline must be in the future"
    ),
});

module.exports = {
  createRfqSchema,
};