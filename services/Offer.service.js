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
    const offers = await OfferModel.find({ country }).select("-applicants");
    return offers;
  }

  async getOffersByCategory(category) {
    const offers = await OfferModel.find({ category }).select("-applicants");
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

  async update(idEmployer, id, data) {
    const ownerEmployer = await OfferModel.findById(id);
    if (ownerEmployer.postOwnerId.toString() !== idEmployer) {
      return {
        error: true,
        message: "Action denied",
      };
    }
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
