const bcrypt = require("bcryptjs");

const {
  checkEmailExists,
  registerEmp,
  updateEmpCode,
  addEmpAddress,
} = require("../models/empModel");

const register = async (req, res) => {
  const {
    empname,
    empphno1,
    empphno2,
    empemail,
    emppassword,
    empdesignation,
    empisactive,
  } = req.body;

  if (
    !empname ||
    !empphno1 ||
    !empphno2 ||
    !empemail ||
    !emppassword ||
    !empdesignation ||
    empisactive === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const existingUser = await checkEmailExists(empemail);
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    const emphashedpswd = await bcrypt.hash(emppassword, 10);
    const role = empemail === "admin@gmail.com" ? "admin" : "user";
    const isActiveValue = empisactive === true || empisactive === "true";

    const empid = await registerEmp(
      empname,
      empphno1,
      empphno2,
      empemail,
      emphashedpswd,
      empdesignation,
      isActiveValue
    );

    const empcode = await updateEmpCode(empid);

    res.status(200).json({
      success: true,
      message: "Employee registered successfully.",
      empcode,
      role: role,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const addAddress = async (req, res) => {
  const { empid, empstate, empcity, empcountry, emppincode } = req.body;

  if (!empid || !empstate || !empcity || !empcountry || !emppincode) {
    return res
      .status(400)
      .json({ success: false, message: "All address fields are required." });
  }

  try {
    const empaddressid = await addEmpAddress(
      empid,
      empstate,
      empcity,
      empcountry,
      emppincode
    );

    res.status(200).json({
      success: true,
      message: "Employee address added successfully.",
      empaddressid,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { register, addAddress };
