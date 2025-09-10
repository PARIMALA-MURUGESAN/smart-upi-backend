const express = require("express");
const router = express.Router();
const { sendMoney } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/payments/send
router.post("/send", authMiddleware, sendMoney);

module.exports = router;
