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
      const { idPostOwner } = req.params;
      const offers = await offerServ.getByPostOwner(idPostOwner);
      return res.json(offers);
    }
  );

  router.post("/", authValidation, checkRoles("employer"), async (req, res) => {
    const { id } = req.user;
    const body = req.body;
    const newOffer = await offerServ.create(body, id);
    return res.json(newOffer);
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

  router.put(
    "/:id",
    authValidation,
    checkRoles("employer", "admin"),
    async (req, res) => {
      const { id } = req.params;
      const body = req.body;
      const updatedOffer = await offerServ.update(id, body);
      return res.json(updatedOffer);
    }
  );

  router.delete(
    "/:id",
    authValidation,
    checkRoles("employer", "admin"),
    async (req, res) => {
      const { id } = req.params;
      const deletedOffer = await offerServ.delete(id);
      return res.json(deletedOffer);
    }
  );
};

module.exports = offers;
