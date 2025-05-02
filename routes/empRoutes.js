const express = require("express");
const router = express.Router();
const {registerWithAddress} = require("../controllers/empController");


router.post("/registerwithaddress", registerWithAddress);




module.exports = router;