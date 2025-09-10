const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: String, required: true }, // could be UPI ID or mobile number
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  upiUsed: { type: mongoose.Schema.Types.ObjectId, ref: "UPI" },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
1