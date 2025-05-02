const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const dotenv = require("dotenv");

const empLogin = async (req, res) => {
  try {
    const { empemail, emppassword } = req.body;
    if (!empemail || !emppassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM employeemaster WHERE empemail = ?",
      [empemail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(emppassword, user.emppassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const role = user.empemail === "admin@gmail.com" ? "admin" : "user";

    const token = jwt.sign(
      {
        empid: user.empid,
        empemail: user.empemail,
        role,
      },
      "process.env.JWT_SECRET",
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      empcode: user.empcode,
      role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


module.exports = { empLogin };
