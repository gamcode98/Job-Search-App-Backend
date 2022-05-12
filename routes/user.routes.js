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
    const users = await userServ.getAll();
    return res.json(users);
  });

  router.get(
    "/:email",
    authValidation,
    checkRoles("admin"),
    async (req, res) => {
      const { email } = req.params;
      const user = await userServ.getByEmail(email);
      return res.json(user);
    }
  );

  router.post("/", authValidation, checkRoles("admin"), async (req, res) => {
    const body = req.body;
    const newUser = await authServ.signup(body);
    return res.json(newUser);
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
      const { id } = req.params;
      const deletedUser = await userServ.delete(id);
      return res.json(deletedUser);
    }
  );
};

module.exports = users;
