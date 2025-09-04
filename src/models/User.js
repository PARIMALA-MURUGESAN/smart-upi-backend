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

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  upis: [UpisSchema],
  preferences: [PreferenceSchema]   // user-defined rules
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);
