const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserService = require("./User.service");
const { jwtSecret } = require("./../config/index");

class AuthService {
  async signup(data) {
    if (data.password) {
      data.password = await this.#encrypt(data.password);
    }
    const userServ = new UserService();
    const user = await userServ.create(data);
    if (user.error) {
      return user;
    }
    return this.#getUserData(user);
  }

  async #encrypt(string) {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(string, salt);

      return hash;
    } catch (error) {
      console.log(error);
    }
  }

  #getUserData(user) {
    const userData = {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    };

    const token = this.#createToken(userData);
    return {
      user: userData,
      token,
    };
  }

  #createToken(payload) {
    const token = jwt.sign(payload, jwtSecret);
    return token;
  }

  async login(data) {
    const { email, password } = data;
    const userServ = new UserService();
    const user = await userServ.getByEmail(email);
    if (user && (await this.#compare(password, user.password))) {
      return this.#getUserData(user);
    }

    if (!user) {
      return {
        error: true,
        message: "User not found",
      };
    }
    return {
      error: true,
      message: "Wrong credentials",
    };
  }

  async #compare(string, hash) {
    return await bcrypt.compare(string, hash);
  }
}

module.exports = AuthService;
