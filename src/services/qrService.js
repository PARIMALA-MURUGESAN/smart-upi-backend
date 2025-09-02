const QRCode = require('qrcode');
const { decrypt } = require('./enc')

exports.generateUpiQr = async (vpa, name) => {
  const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name || "User")}&cu=INR`;
  return await QRCode.toDataURL(upiUrl);
};



