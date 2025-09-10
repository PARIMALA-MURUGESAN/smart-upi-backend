const User = require("../models/User");
const { generateUpiQr } = require("../services/qrService");
const {encrypt, decrypt } = require("../services/enc");

// Add UPI with purpose
exports.addUPI = async (req, res) => {
  try {
    const { label, vpa, purpose } = req.body;

    if (!label || !vpa) {
      return res.status(400).json({ message: "Label and VPA are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate vpa
    if (user.upis.find(u => u.vpa_encrypted === vpa)) {
      return res.status(400).json({ error: "UPI already exists" });
    }

    user.upis.push({
      label,
      vpa_encrypted: vpa,
      purpose: purpose || "personal"
    });

    await user.save();
    res.json({ message: "UPI added successfully", upis: user.upis });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getUserUPIs = async (req, res) => {
  try {
    const upis = await UPI.find({ user: req.user.id });
    res.json(upis);
  } catch (err) {
    res.status(500).json({ message: "Error fetching UPIs" });
  }
};
// Get Smart QR by purpose
exports.getSmartQr = async (req, res) => {
  try {
    const { purpose } = req.params; // salary / business / personal
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const upi = user.upis.find(u => u.purpose === purpose);
    if (!upi) return res.status(400).json({ error: `No UPI set for purpose: ${purpose}` });

   let vpa;
    try {
      vpa = decrypt(upi.vpa_encrypted);  // ✅ works for new encrypted entries
    } catch {
      vpa = upi.vpa_encrypted;           // ✅ fallback for old unencrypted entries
    }
    const qrImage = await generateUpiQr(vpa, user.email);

    res.json({ purpose, qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
};

exports.getQrByPurpose = async (req, res) => {
  try {
    const { purpose } = req.params;

    const user = await User.findById(req.user.id); // from auth middleware
    if (!user) return res.status(404).json({ error: "User not found" });

    // find the UPI mapped to this purpose
    const matchedUpi = user.upis.find(u => u.purpose === purpose);

    if (!matchedUpi) {
      return res.status(404).json({ error: `No UPI found for ${purpose}` });
    }

    const vpa = decrypt(matchedUpi.vpa_encrypted);
    const qrImage = await generateUpiQr(vpa, user.name);

    res.json({ purpose, vpa, qrImage });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
};
