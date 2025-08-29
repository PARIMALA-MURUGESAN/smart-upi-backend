const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String, // "SET_PREFERRED" | "GENERATE_QR"
  upiId: String,
  createdAt: { type: Date, default: Date.now }
});
