const mongoose = require("mongoose");

const UpisSchema = new mongoose.Schema({
  label: { type: String, required: true },         // "Personal GPay", "Work Paytm"
  vpa_encrypted: { type: String, required: true }, // encrypted VPA like user@upi
  purpose: {                                       // NEW FIELD
    type: String,
    default: "personal"
  },
  meta: {
    addedAt: { type: Date, default: Date.now }
  }
});
const PreferenceSchema = new mongoose.Schema({
  condition: { type: String, required: true },   // "amount_gt", "from", "default"
  value: { type: String },                       // "500000" OR "Company XYZ"
  targetPurpose: { type: String, required: true } // "salary" | "business" | "personal"
});
const HistorySchema = new mongoose.Schema({
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  sender: { type: String },
  to: { type: String },          // UPI VPA credited
  purpose: { type: String },     // salary / business / personal
  at: { type: Date, default: Date.now }
});
const TransactionSchema = new mongoose.Schema({
  type: String,      // "credit" | "debit"
  amount: Number,
  sender: String,
  to: String,        // VPA
  purpose: String,   // salary / business / personal
  at: { type: Date, default: Date.now }
});
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  upis: [UpisSchema],
  preferences: [PreferenceSchema],
  history: { type: [HistorySchema], default: [] }  // user-defined rules
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);
