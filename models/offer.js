const { mongoose } = require("./../config/db");

const Schema = mongoose.Schema;

const offerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    country: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    applicants: {
      type: [String],
    },
    salary: {
      type: Number,
      required: true,
    },
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
