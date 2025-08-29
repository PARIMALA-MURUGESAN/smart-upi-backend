const express = require('express');
const router = express.Router();
const { getQr } = require('../controllers/upiController');

const auth = require('../middleware/auth');

router.get('/qr', auth, getQr);
router.get('/pay/:userId', handlePaymentLink);
router.get('/history', auth, async (req, res) => {
  const logs = await History.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(logs);
});


module.exports = router;
