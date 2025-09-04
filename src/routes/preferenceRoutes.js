const express = require("express");
const router = express.Router();
const { addPreference } = require("../controllers/preferenceController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, addPreference);

module.exports = router;
