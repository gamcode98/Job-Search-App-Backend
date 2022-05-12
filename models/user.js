const { mongoose } = require("./../config/db");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["postulant", "employer", "admin"],
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
