const express = require("express");
const UserService = require("./../services/User.service");
const AuthService = require("./../services/Auth.service");
const {
  authValidation,
  checkRoles,
} = require("./../middleware/authValidation");

const users = (app) => {
  const userServ = new UserService();
  const authServ = new AuthService();

  const router = express.Router();

  app.use("/api/users", router);

  router.get("/", authValidation, checkRoles("admin"), async (req, res) => {
    try {
      const users = await userServ.getAll();
      return res.json(users);
    } catch (error) {
      return res.json(error);
    }
  });

  router.get(
    "/:email",
    authValidation,
    checkRoles("admin"),
    async (req, res) => {
      try {
        const { email } = req.params;
        const user = await userServ.getByEmail(email);
        const userData = {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user.id,
        };
        return res.json(userData);
      } catch (error) {
        console.log(error);
        return res
          .status(404)
          .json({ error: true, message: "Email not found" });
      }
    }
  );

  router.post("/", authValidation, checkRoles("admin"), async (req, res) => {
    try {
      const body = req.body;
      const newUser = await authServ.signup(body);
      return res.json(newUser);
    } catch (error) {
      return res.json(error);
    }
  });

  router.put(
    "/:id",
    authValidation,
    checkRoles("postulant", "employer", "admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const body = req.body;
        const updatedUser = await userServ.update(id, body);
        return res.json(updatedUser);
      } catch (error) {
        console.log(error);
      }
    }
  );

  router.delete(
    "/:id",
    authValidation,
    checkRoles("postulant", "employer", "admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const deletedUser = await userServ.delete(id);
        if (!deletedUser) {
          return res.status(404).json({
            error: true,
            message: "User not found",
          });
        }
        return res.json({ message: "deleted", deletedUser });
      } catch (error) {
        return res.status(400).json({ error: true, message: "Id invalid" });
      }
    }
  );
};

module.exports = users;
