const bcrypt = require("bcryptjs");
const {
  checkEmailExists,
  registerEmp,
  updateEmpCode,
  addEmpAddress,
} = require("../models/empModel");

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
const INTL_PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;
const PINCODE_REGEX = /^\d{6}$/;

// Utility: Validate input fields
const validateInput = (data) => {
  const {
    empname,
    empphno1,
    empphno2,
    empemail,
    emppassword,
    empdesignation,
    empisactive,
    empstate,
    empcity,
    empcountry,
    emppincode,
  } = data;

  if (
    !empname ||
    !empphno1 ||
    !empphno2 ||
    !empemail ||
    !emppassword ||
    !empdesignation ||
    empisactive === undefined ||
    !empstate ||
    !empcity ||
    !empcountry ||
    !emppincode
  ) {
    return "All fields are required.";
  }

  if (!EMAIL_REGEX.test(empemail)) {
    return "Invalid email format.";
  }

  if (!STRONG_PASSWORD_REGEX.test(emppassword)) {
    return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
  }

  if (
    !INTL_PHONE_REGEX.test(String(empphno1)) ||
    !INTL_PHONE_REGEX.test(String(empphno2))
  ) {
    return "Phone numbers must be at least 10 digits long and follow international format (e.g., +14155552671).";
  }

  if (!PINCODE_REGEX.test(emppincode)) {
    return "Pincode must be 6 digits.";
  }

  return null;
};

const registerWithAddress = async (req, res) => {
  try {
    const validationError = validateInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {
      empname,
      empphno1,
      empphno2,
      empemail,
      emppassword,
      empdesignation,
      empisactive,
      empstate,
      empcity,
      empcountry,
      emppincode,
    } = req.body;

    const emailExists = await checkEmailExists(empemail);
    if (emailExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(emppassword, 10);
    const role = empemail === "admin@gmail.com" ? "admin" : "user";
    const isActive = empisactive === true || empisactive === "true";

    const empId = await registerEmp(
      empname,
      empphno1,
      empphno2,
      empemail,
      hashedPassword,
      empdesignation,
      isActive
    );

    const empCode = await updateEmpCode(empId);
    const addressId = await addEmpAddress(
      empId,
      empstate,
      empcity,
      empcountry,
      emppincode
    );

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully.",
      empcode: empCode,
      empaddressid: addressId,
      role,
    });
  } catch (error) {
    console.error("Error in registerWithAddress:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  registerWithAddress,
};
