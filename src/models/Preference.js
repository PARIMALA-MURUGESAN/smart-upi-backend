const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conditions: [
    {
      minAmount: { type: Number, required: true },
      maxAmount: { type: Number, required: true },
      preferredUPI: { type: mongoose.Schema.Types.ObjectId, ref: "UPI", required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Preference", preferenceSchema);
