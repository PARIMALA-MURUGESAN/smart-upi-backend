import User from "../models/User.js";

export const addTransaction = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: "Amount and description required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const transaction = {
      amount,
      description,
      date: new Date()
    };

    user.history.push(transaction);
    await user.save();

    res.json({ message: "Transaction added", history: user.history });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ history: user.history });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
