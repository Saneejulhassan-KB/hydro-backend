const pool = require("../config/db");

const checkEmailExists = async (empemail) => {
  const [rows] = await pool.query(
    "SELECT * FROM employeemaster WHERE empemail=?",
    [empemail]
  );

  return rows;
};

const registerEmp = async (
  empname,
  empphno1,
  empphno2,
  empemail,
  emphashedpswd,
  empdesignation,
  empisactive
) => {
  const [result] = await pool.query(
    "INSERT INTO employeemaster ( empname, empphno1, empphno2, empemail, emppassword, empdesignation, empisactive) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      empname,
      empphno1,
      empphno2,
      empemail,
      emphashedpswd,
      empdesignation,
      empisactive,
    ]
  );
  return result.insertId;
};

const updateEmpCode = async (empid) => {
  const empcode = `EMP${String(empid).padStart(3, "0")}`;
  await pool.query("UPDATE employeemaster SET empcode = ? WHERE empid = ?", [
    empcode,
    empid,
  ]);
  return empcode;
};

const addEmpAddress = async (
  empid,
  empstate,
  empcity,
  empcountry,
  emppincode
) => {
  const [result] = await pool.query(
    "INSERT INTO empaddress (empstate, empcity, empcountry, emppincode, empid) VALUES (?, ?, ?, ?, ?)",
    [empstate, empcity, empcountry, emppincode, empid]
  );
  return result.insertId;
};

module.exports = {
  checkEmailExists,
  registerEmp,
  updateEmpCode,
  addEmpAddress,
};
