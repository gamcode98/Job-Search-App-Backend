const OfferModel = require("./../models/offer");
const UserModel = require("./../models/user");

class OfferService {
  async getAll() {
    const offers = await OfferModel.find();
    return offers;
  }

  async getByPostOwner(postOwnerId) {
    const offers = await OfferModel.find({ postOwnerId });
    return offers;
  }

  async assignApplicant(idOffer, idPostulant) {
    const offer = await OfferModel.findById(idOffer);

    offer.applicants.push(idPostulant);

    const updatedOffer = await OfferModel.findByIdAndUpdate(idOffer, offer, {
      new: true,
    });

    return updatedOffer;
  }

  async getOffersByCountry(country) {
    const offers = await OfferModel.find({ country });
    return offers;
  }

  async getOffersByCategory(category) {
    const offers = await OfferModel.find({ category });
    return offers;
  }

  async create(data, id) {
    const dataOffer = {
      ...data,
      postOwnerId: id,
    };
    const offer = await OfferModel.create(dataOffer);
    return offer;
  }

  async update(id, data) {
    const updatedOffer = await OfferModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedOffer;
  }

  async delete(id) {
    const deletedOffer = await OfferModel.findByIdAndDelete(id);
    return deletedOffer;
  }
}

module.exports = OfferService;
