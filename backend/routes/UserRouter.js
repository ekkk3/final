const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {
  
});

// API: GET /api/user/list
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name"); // dùng projection
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng." });
  }
});

const mongoose = require("mongoose");

// API: GET /api/user/:id
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  // Kiểm tra ObjectId có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId, "_id first_name last_name location description occupation");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;