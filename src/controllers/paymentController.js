const Transaction = require("../models/Transaction");
const Preference = require("../models/Preference");
const UPI = require("../models/UPI");

exports.sendMoney = async (req, res) => {
  try {
    const { receiver, amount, note } = req.body;

    // get user preferences
    const preference = await Preference.findOne({ user: req.user.id }).populate("conditions.preferredUPI");

    let selectedUPI;
    if (preference) {
      for (let condition of preference.conditions) {
        if (amount >= condition.minAmount && amount <= condition.maxAmount) {
          selectedUPI = condition.preferredUPI;
          break;
        }
      }
    }

    if (!selectedUPI) {
      selectedUPI = await UPI.findOne({ user: req.user.id, isDefault: true });
    }

    if (!selectedUPI) {
      return res.status(400).json({ message: "No UPI available to send money" });
    }

    // simulate transaction
    const transaction = await Transaction.create({
      sender: req.user.id,
      receiver,
      amount,
      status: "success", // mock
      upiUsed: selectedUPI._id,
      note
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Error sending money", error: err.message });
  }
};
