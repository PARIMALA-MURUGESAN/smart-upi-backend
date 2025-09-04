const User = require("../models/User");
const { decideAccount } = require("./preferenceController");

// Simulate receiving a payment
exports.receivePayment = async (req, res) => {
  try {
    const { amount, sender } = req.body;  // payment info from request

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Decide which account (purpose) should get this money
    const targetPurpose = decideAccount(user, { amount, sender });

    // Find UPI that matches the target purpose
    const matchedUpi = user.upis.find(u => u.purpose === targetPurpose);
    if (!matchedUpi) {
      return res.status(400).json({ error: `No UPI set for purpose: ${targetPurpose}` });
    }

    // Save transaction history (optional)
    user.history.push({
      type: "credit",
      amount,
      sender,
      to: matchedUpi.vpa_encrypted,
      purpose: targetPurpose,
      at: new Date()
    });
    await user.save();

    res.json({
      message: "Payment routed successfully",
      creditedTo: matchedUpi.label,
      vpa: matchedUpi.vpa_encrypted,
      purpose: targetPurpose
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process payment" });
  }
};
