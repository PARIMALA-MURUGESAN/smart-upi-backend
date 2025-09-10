const mongoose = require("mongoose");

const upiSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upiId: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("UPI", upiSchema);
