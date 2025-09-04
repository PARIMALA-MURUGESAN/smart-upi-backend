const User = require("../models/User");

// Add user preference
exports.addPreference = async (req, res) => {
  try {
    const { condition, value, targetPurpose } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.preferences.push({ condition, value, targetPurpose });
    await user.save();

    res.json({ message: "Preference added", preferences: user.preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add preference" });
  }
};
async function addPreference(req, res) {
  try {
    const { condition, value, targetPurpose } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.preferences.push({ condition, value, targetPurpose });
    await user.save();

    res.json({ message: "Preference added", preferences: user.preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add preference" });
  }
}
// Utility to decide account dynamically
exports.decideAccount = (user, payment) => {
  for (let rule of user.preferences) {
    if (rule.condition === "amount_gt" && payment.amount > Number(rule.value)) {
      return rule.targetPurpose;
    }
    if (rule.condition === "from" && payment.sender === rule.value) {
      return rule.targetPurpose;
    }
    if (rule.condition === "default") {
      return rule.targetPurpose;
    }
  }
  return "personal"; // fallback
};
// Decide which account/purpose to route the payment to
function decideAccount(user, payment) {
  for (let rule of user.preferences) {
    if (rule.condition === "amount_gt" && payment.amount > Number(rule.value)) {
      return rule.targetPurpose;
    }
    if (rule.condition === "from" && payment.sender === rule.value) {
      return rule.targetPurpose;
    }
    if (rule.condition === "default") {
      return rule.targetPurpose;
    }
  }
  return "personal"; // fallback
}

module.exports = {
  addPreference,
  decideAccount
};
