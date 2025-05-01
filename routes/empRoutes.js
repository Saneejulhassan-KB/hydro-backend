const express = require("express");
const router = express.Router();
const {register,addAddress} = require("../controllers/empController");


router.post("/empregister", register);

router.post("/empaddress", addAddress);


module.exports = router;