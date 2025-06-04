const mongoose = require("mongoose");

/**
 * Định nghĩa Mongoose Schema cho một Bình luận (Comment).
 */
const commentSchema = new mongoose.Schema({
  // Nội dung bình luận.
  comment: String,
  // Ngày và giờ tạo bình luận.
  date_time: { type: Date, default: Date.now },
  // ID của người dùng đã tạo bình luận.
  user_id: mongoose.Schema.Types.ObjectId,
});

/**
 * Định nghĩa Mongoose Schema cho một Ảnh (Photo).
 */
const photoSchema = new mongoose.Schema({
  // Tên file chứa ảnh (trong thư mục project6/images).
  file_name: { type: String },
  // Ngày và giờ thêm ảnh vào cơ sở dữ liệu.
  date_time: { type: Date, default: Date.now },
  // ID của người dùng đã tạo ảnh.
  user_id: mongoose.Schema.Types.ObjectId,
  // Mảng các đối tượng bình luận cho ảnh này.
  comments: [commentSchema],
});

/**
 * Tạo Mongoose Model cho Ảnh sử dụng photoSchema.
 */
const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

/**
 * Xuất module này để sử dụng trong ứng dụng.
 */
module.exports = Photo;