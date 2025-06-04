const mongoose = require("mongoose");
require("dotenv").config();

const models = require("../modelData/models.js");

const User = require("../db/userModel.js");
const Photo = require("../db/photoModel.js");
const SchemaInfo = require("../db/schemaInfo.js");

const versionString = "1.0";

//Kết nối MongoDB, báo lỗi nếu không kết nối được.
async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable connecting to MongoDB Atlas!");
  }

  //Xóa sạch các documents trong các collection: users, photos, schemainfo
  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});

  //userModels: danh sách người dùng mẫu.
  const userModels = models.userListModel();
  //mapFakeId2RealId: ánh xạ ID giả trong data mẫu sang ID thật sau khi lưu vào MongoDB.
  const mapFakeId2RealId = {};

  //Tạo từng user trong MongoDB.
  //Gán objectID thật lại vào object mẫu để xử lý tiếp (nhất là liên kết comment sau).
  for (const user of userModels) {
    userObj = new User({
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;
      console.log(
        "Adding user:",
        user.first_name + " " + user.last_name,
        " with ID ",
        user.objectID,
      );
    } catch (error) {
      console.error("Error create user", error);
    }
  }

  //Lấy danh sách ảnh từ data mẫu theo từng user.
  //Ghép toàn bộ ảnh của các user vào mảng photoModels
  const photoModels = [];
  const userIDs = Object.keys(mapFakeId2RealId);
  userIDs.forEach(function (id) {
    photoModels.push(...models.photoOfUserModel(id));
  });
  for (const photo of photoModels) {
    photoObj = await Photo.create({
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: mapFakeId2RealId[photo.user_id],
    });
    photo.objectID = photoObj._id;

    //Tạo mỗi ảnh, gắn đúng user_id thực tế.
    if (photo.comments) {
      photo.comments.forEach(function (comment) {
        photoObj.comments = photoObj.comments.concat([
          {
            comment: comment.comment,
            date_time: comment.date_time,
            user_id: comment.user.objectID,
          },
        ]);
        console.log(
          "Adding comment of length %d by user %s to photo %s",
          comment.comment.length,
          comment.user.objectID,
          photo.file_name,
        );
      });
    }
    try {
      await photoObj.save();
      console.log(
        "Adding photo:",
        photo.file_name,
        " of user ID ",
        photoObj.user_id,
      );
    } catch (error) {
      console.error("Error create photo", error);
    }
  }
  //Với mỗi ảnh, nếu có comment thì:
  //Thêm comment vào photoObj
  //Gắn đúng user thật nhờ objectID
  //Lưu photoObj vào MongoDB.
  //Nếu có comment thì thêm vào mảng comments của photoObj.
  try {
    //Tạo một SchemaInfo object để lưu trữ thông tin về schema version.
    schemaInfo = await SchemaInfo.create({
      version: versionString,
    });
    console.log("SchemaInfo object created with version ", schemaInfo.version);
  } catch (error) {
    console.error("Error create schemaInfo", reportError);
  }
  mongoose.disconnect();//ngắt kết nối MongoDB sau khi hoàn thành.
}
//gọi hàm dbLoad để thực thi.
dbLoad();
