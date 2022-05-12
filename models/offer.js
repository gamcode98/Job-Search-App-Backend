const { mongoose } = require("./../config/db");

const Schema = mongoose.Schema;

const offerSchema = new Schema(
  {
    name: String,
    description: String,
    category: [String],
    country: [String],
    applicants: [String],
    salary: Number,
    postOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);

const OfferSchema = mongoose.model("Offer", offerSchema);

module.exports = OfferSchema;
