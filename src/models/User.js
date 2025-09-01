// src/models/User.js
const mongoose = require('mongoose');

const UpisSchema = new mongoose.Schema({
  label: String,            // e.g., "Personal GPay", "Work Paytm"
  vpa_encrypted: String,    // encrypted VPA (user@bank)
  meta: {
    addedAt: { type: Date, default: Date.now }
  }
});

const PreferenceSchema = new mongoose.Schema({
  preferredUpiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User.upis' },
  updatedAt: Date
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String,required: true, unique: true },
  password: { type: String, required: true },
  upis: [UpisSchema],
  preference: PreferenceSchema,
  history: [
  {
    amount: Number,
    to: String,
    from: String,
    timestamp: { type: Date, default: Date.now }
  }
]

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
