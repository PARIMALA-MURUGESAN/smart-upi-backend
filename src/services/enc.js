// src/services/enc.js
const crypto = require("crypto");

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("❌ Missing ENCRYPTION_KEY in environment variables.");
}

// Use utf8 instead of hex unless you actually encoded it as hex
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "utf8"); // must be 32 chars

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

function decrypt(payload) {
  const data = Buffer.from(payload, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const ciphertext = data.slice(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return dec.toString("utf8");
}

module.exports = { encrypt, decrypt };
