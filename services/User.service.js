const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

class UserService {
  async getAll() {
    const users = await UserModel.find().select("-password");
    return users;
  }

  async getByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async create(data) {
    const newUser = await UserModel.create(data);
    return newUser;
  }

  async update(id, data) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    const userData = {
      ...data,
      password: hash,
    };
    const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
    });

    return updatedUser;
  }

  async delete(id) {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    return deletedUser;
  }
}

module.exports = UserService;
