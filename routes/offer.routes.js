const express = require("express");
const OfferService = require("./../services/Offer.service");
const {
  authValidation,
  checkRoles,
} = require("./../middleware/authValidation");

const offers = (app) => {
  const offerServ = new OfferService();
  const router = express.Router();

  app.use("/api/offers", router);

  router.get(
    "/",
    authValidation,
    checkRoles("postulant", "admin"),
    async (req, res) => {
      const objQuery = req.query;
      if (Object.keys(objQuery).length !== 0) {
        if (objQuery.hasOwnProperty("country")) {
          const country = objQuery["country"];

          const offersByCountry = await offerServ.getOffersByCountry(country);
          if (offersByCountry.length === 0) {
            return res.status(404).json({ message: "Country not found" });
          }

          return res.json(offersByCountry);
        }
        if (objQuery.hasOwnProperty("category")) {
          const category = objQuery["category"];
          const offersByCategory = await offerServ.getOffersByCategory(
            category
          );

          if (offersByCategory.length === 0) {
            return res.status(404).json({ message: "Category not found" });
          }
          return res.json(offersByCategory);
        }
      } else {
        const offers = await offerServ.getAll();
        return res.json(offers);
      }
    }
  );

  router.get(
    "/:idPostOwner",
    authValidation,
    checkRoles("employer", "admin"),
    async (req, res) => {
      try {
        const { idPostOwner } = req.params;
        const offers = await offerServ.getByPostOwner(idPostOwner);
        if (offers.length === 0) {
          return res.json({ error: true, message: "Offers not found " });
        }
        return res.json(offers);
      } catch (error) {
        return res.status(400).json({ error: true, message: "Id invalid" });
      }
    }
  );

  router.post("/", authValidation, checkRoles("employer"), async (req, res) => {
    try {
      const { id } = req.user;
      const body = req.body;
      const newOffer = await offerServ.create(body, id);
      return res.json(newOffer);
    } catch ({ message }) {
      return res.json({ error: true, message: message });
    }
  });
  router.put(
    "/:idOffer",
    authValidation,
    checkRoles("postulant"),
    async (req, res) => {
      const { id } = req.user;
      const { idOffer } = req.params;
      const offerUpdated = await offerServ.assignApplicant(idOffer, id);
      return res.json(offerUpdated);
    }
  );
  router.patch(
    "/:id",
    authValidation,
    checkRoles("employer"),
    async (req, res) => {
      try {
        const idEmployer = req.user.id;
        const { id } = req.params;
        const body = req.body;

        const updatedOffer = await offerServ.update(idEmployer, id, body);
        return res.json(updatedOffer);
      } catch (error) {
        return res.status(400).json({ error: true, message: "Id invalid" });
      }
    }
  );

  router.delete(
    "/:id",
    authValidation,
    checkRoles("employer", "admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const deletedOffer = await offerServ.delete(id);

        if (!deletedOffer) {
          return res.status(404).json({
            error: true,
            message: "Offer not found",
          });
        }
        return res.json({ messaje: "Deleted", deletedOffer });
      } catch (error) {
        return res.status(400).json({ error: true, message: "Id invalid" });
      }
    }
  );
};

module.exports = offers;
