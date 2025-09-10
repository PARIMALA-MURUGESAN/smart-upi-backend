const express = require("express");
const router = express.Router();
const { sendPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/payments/send
router.post("/send", authMiddleware, sendPayment);

module.exports = router;
