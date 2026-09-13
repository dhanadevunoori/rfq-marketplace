const pool = require("../config/db");

async function createRfq(req, res) {
  try {
    const {
      productName,
      description,
      quantity,
      deliveryLocation,
      deadline,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO rfqs
       (product_name, description, quantity, delivery_location, deadline, buyer_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productName,
        description,
        quantity,
        deliveryLocation,
        new Date(deadline),
        req.user.userId,
      ]
    );

    const [rfqs] = await pool.query(
      `SELECT
        id,
        product_name AS productName,
        description,
        quantity,
        delivery_location AS deliveryLocation,
        deadline,
        status,
        buyer_id AS buyerId,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM rfqs
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "RFQ created successfully",
      rfq: rfqs[0],
    });
  } catch (error) {
    console.error("Create RFQ error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create RFQ",
    });
  }
}

async function getMyRfqs(req, res) {
  try {
    const [rfqs] = await pool.query(
      `SELECT
        id,
        product_name AS productName,
        description,
        quantity,
        delivery_location AS deliveryLocation,
        deadline,
        status,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM rfqs
       WHERE buyer_id = ?
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json({
      success: true,
      rfqs,
    });
  } catch (error) {
    console.error("Get RFQs error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch RFQs",
    });
  }
}

async function getRfqById(req, res) {
  try {
    const { id } = req.params;

    const [rfqs] = await pool.query(
      `SELECT
        id,
        product_name AS productName,
        description,
        quantity,
        delivery_location AS deliveryLocation,
        deadline,
        status,
        buyer_id AS buyerId,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM rfqs
       WHERE id = ? AND buyer_id = ?`,
      [id, req.user.userId]
    );

    if (rfqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.json({
      success: true,
      rfq: rfqs[0],
    });
  } catch (error) {
    console.error("Get RFQ error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch RFQ",
    });
  }
}

async function updateRfq(req, res) {
  try {
    const { id } = req.params;

    const {
      productName,
      description,
      quantity,
      deliveryLocation,
      deadline,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE rfqs
       SET
         product_name = ?,
         description = ?,
         quantity = ?,
         delivery_location = ?,
         deadline = ?
       WHERE id = ? AND buyer_id = ? AND status = 'OPEN'`,
      [
        productName,
        description,
        quantity,
        deliveryLocation,
        new Date(deadline),
        id,
        req.user.userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found or cannot be edited",
      });
    }

    res.json({
      success: true,
      message: "RFQ updated successfully",
    });
  } catch (error) {
    console.error("Update RFQ error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update RFQ",
    });
  }
}

async function closeRfq(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE rfqs
       SET status = 'CLOSED'
       WHERE id = ? AND buyer_id = ? AND status = 'OPEN'`,
      [id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found or already closed",
      });
    }

    res.json({
      success: true,
      message: "RFQ closed successfully",
    });
  } catch (error) {
    console.error("Close RFQ error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to close RFQ",
    });
  }
}

async function getAvailableRfqs(req, res) {
  try {
    const { search, location, status } = req.query;

    let query = `
      SELECT
        r.id,
        r.product_name AS productName,
        r.description,
        r.quantity,
        r.delivery_location AS deliveryLocation,
        r.deadline,
        r.status,
        r.created_at AS createdAt,
        u.name AS buyerName
      FROM rfqs r
      JOIN users u ON r.buyer_id = u.id
      WHERE r.status = 'OPEN'
        AND r.deadline > NOW()
    `;

    const params = [];

    if (search) {
      query += `
        AND (
          r.product_name LIKE ?
          OR r.description LIKE ?
        )
      `;

      const searchValue = `%${search}%`;

      params.push(searchValue, searchValue);
    }

    if (location) {
      query += `
        AND r.delivery_location LIKE ?
      `;

      params.push(`%${location}%`);
    }

    if (status === "OPEN") {
      query += ` AND r.status = 'OPEN'`;
    }

    query += `
      ORDER BY r.created_at DESC
    `;

    const [rfqs] = await pool.query(query, params);

    res.json({
      success: true,
      rfqs,
    });
  } catch (error) {
    console.error("Get available RFQs error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch available RFQs",
    });
  }
}

async function getAvailableRfqById(req, res) {
  try {
    const { id } = req.params;

    const [rfqs] = await pool.query(
      `SELECT
        r.id,
        r.product_name AS productName,
        r.description,
        r.quantity,
        r.delivery_location AS deliveryLocation,
        r.deadline,
        r.status,
        r.created_at AS createdAt,
        r.updated_at AS updatedAt,
        u.name AS buyerName
       FROM rfqs r
       JOIN users u ON r.buyer_id = u.id
       WHERE r.id = ?
         AND r.status = 'OPEN'
         AND r.deadline > NOW()`,
      [id]
    );

    if (rfqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found or no longer available",
      });
    }

    res.json({
      success: true,
      rfq: rfqs[0],
    });
  } catch (error) {
    console.error("Get available RFQ error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch RFQ",
    });
  }
}

module.exports = {
  createRfq,
  getMyRfqs,
  getRfqById,
  updateRfq,
  closeRfq,
  getAvailableRfqs,
  getAvailableRfqById,
};