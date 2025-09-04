const express = require("express");
const router = express.Router();
const { receivePayment } = require("../controllers/paymentController");
const auth = require("../middleware/authMiddleware");

router.post("/receive", auth, receivePayment);

module.exports = router;
