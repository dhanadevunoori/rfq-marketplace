require("dotenv").config();

const pool = require("./db");

async function testDatabase() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ MySQL connected successfully");

    connection.release();
    await pool.end();
  } catch (error) {
    console.error("❌ MySQL connection failed");
    console.error(error.message);
  }
}

testDatabase();