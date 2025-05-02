const express = require("express");
const router = express.Router();
const { registerWithAddress } = require("../controllers/empRegisterController");
const { empLogin } = require("../controllers/empLoginController");

router.post("/registerwithaddress", registerWithAddress);
router.post("/emplogin", empLogin);

module.exports = router;
