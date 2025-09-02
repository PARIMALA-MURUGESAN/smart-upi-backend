const mongoose = require("mongoose");

const UpiSchema = new mongoose.Schema({
  label: { type: String, required: true },         // "Personal GPay", "Work Paytm"
  vpa_encrypted: { type: String, required: true }, // encrypted VPA like user@upi
  purpose: {                                       // NEW FIELD
    type: String,
    enum: ["salary", "business", "personal"],
    default: "personal"
  },
  meta: {
    addedAt: { type: Date, default: Date.now }
  }
});

const UserSchema = new mongoose.Schema({
  name:String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  upis: [UpiSchema],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
