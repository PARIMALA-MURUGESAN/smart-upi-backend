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
  history: [{
    event: String, // 'SET_PREFERRED', 'SHARE_PAYMENT'
    upiIndex: Number,
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
