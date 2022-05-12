const UserModel = require("../models/user");

class UserService {
  async getAll() {
    const users = await UserModel.find();
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
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
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
