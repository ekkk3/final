const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../db/userModel"); // ← THÊM DÒNG NÀY

router.post("/", async (request, response) => {
  
});

// GET /api/photo/photosOfUser/:id
router.get("/photosOfUser/:id", async (req, res) => {
  const userId = req.params.id;

  // Kiểm tra ObjectId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Kiểm tra user có tồn tại không
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    // Lấy ảnh của user
    const photos = await Photo.find({ user_id: userId });

    // Duyệt từng ảnh để populate comments
    const photoList = await Promise.all(photos.map(async (photo) => {
      // Tạo bản sao plain object
      const photoObj = {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: []
      };

      // Duyệt comment để gắn thêm info người dùng
      for (const comment of photo.comments) {
        const commenter = await User.findById(comment.user_id, "_id first_name last_name");
        if (commenter) {
          photoObj.comments.push({
            _id: commenter._id,
            first_name: commenter.first_name,
            last_name: commenter.last_name,
            comment: comment.comment,
            date_time: comment.date_time
          });
        }
      }

      return photoObj;
    }));

    res.status(200).json(photoList);

  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
