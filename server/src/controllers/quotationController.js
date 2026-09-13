const pool = require("../config/db");

async function createQuotation(req, res) {
  try {
    const {
      rfqId,
      quotedPrice,
      estimatedDelivery,
      message,
    } = req.body;

    // Check that the RFQ exists and is still available
    const [rfqs] = await pool.query(
      `SELECT id
       FROM rfqs
       WHERE id = ?
         AND status = 'OPEN'
         AND deadline > NOW()`,
      [rfqId]
    );

    if (rfqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found or no longer available",
      });
    }

    // Check if supplier already submitted a quotation
    const [existingQuotes] = await pool.query(
      `SELECT id
       FROM quotations
       WHERE rfq_id = ?
         AND supplier_id = ?`,
      [rfqId, req.user.userId]
    );

    if (existingQuotes.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a quotation for this RFQ",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO quotations
       (
         rfq_id,
         supplier_id,
         quoted_price,
         estimated_delivery,
         message
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        rfqId,
        req.user.userId,
        quotedPrice,
        estimatedDelivery,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Quotation submitted successfully",
      quotation: {
        id: result.insertId,
        rfqId,
        supplierId: req.user.userId,
        quotedPrice,
        estimatedDelivery,
        message,
      },
    });
  } catch (error) {
    console.error("Create quotation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit quotation",
    });
  }
}

async function getMyQuotations(req, res) {
  try {
    const [quotations] = await pool.query(
      `SELECT
        q.id,
        q.rfq_id AS rfqId,
        q.quoted_price AS quotedPrice,
        q.estimated_delivery AS estimatedDelivery,
        q.message,
        q.created_at AS createdAt,
        r.product_name AS productName,
        r.delivery_location AS deliveryLocation,
        r.status AS rfqStatus
       FROM quotations q
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.supplier_id = ?
       ORDER BY q.created_at DESC`,
      [req.user.userId]
    );

    res.json({
      success: true,
      quotations,
    });
  } catch (error) {
    console.error("Get supplier quotations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch quotations",
    });
  }
}

async function getQuotationsForRfq(req, res) {
  try {
    const { rfqId } = req.params;

    // Make sure this RFQ belongs to the logged-in buyer
    const [rfqs] = await pool.query(
      `SELECT id
       FROM rfqs
       WHERE id = ?
         AND buyer_id = ?`,
      [rfqId, req.user.userId]
    );

    if (rfqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    const [quotations] = await pool.query(
      `SELECT
        q.id,
        q.quoted_price AS quotedPrice,
        q.estimated_delivery AS estimatedDelivery,
        q.message,
        q.created_at AS createdAt,
        u.id AS supplierId,
        u.name AS supplierName,
        u.email AS supplierEmail
       FROM quotations q
       JOIN users u ON q.supplier_id = u.id
       WHERE q.rfq_id = ?
       ORDER BY q.quoted_price ASC`,
      [rfqId]
    );

    res.json({
      success: true,
      quotations,
    });
  } catch (error) {
    console.error("Get RFQ quotations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch quotations",
    });
  }
}

module.exports = {
  createQuotation,
  getMyQuotations,
  getQuotationsForRfq,
};