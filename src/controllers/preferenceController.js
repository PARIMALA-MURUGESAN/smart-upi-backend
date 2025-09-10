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
const Preference = require("../models/Preference");

exports.setPreferences = async (req, res) => {
  try {
    const { conditions } = req.body;
    let preference = await Preference.findOne({ user: req.user.id });

    if (!preference) {
      preference = await Preference.create({ user: req.user.id, conditions });
    } else {
      preference.conditions = conditions;
      await preference.save();
    }

    res.json(preference);
  } catch (err) {
    res.status(500).json({ message: "Error saving preferences" });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const preference = await Preference.findOne({ user: req.user.id }).populate("conditions.preferredUPI");
    res.json(preference);
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences" });
  }
};
