const QRCode = require('qrcode');
const { decrypt } = require('./enc');

async function generateUpiQr(user) {
  const preferred = user.upis.id(user.preference.preferredUpiId);
  if (!preferred) throw new Error("No preferred UPI set");

  const vpa = decrypt(preferred.vpa_encrypted);
  const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(user.name)}&cu=INR`;

  const qrDataUrl = await QRCode.toDataURL(upiLink);
  return { upiLink, qrDataUrl };
}

module.exports = { generateUpiQr };


