const mongoose = require("mongoose");



const ListingSchema = new mongoose.Schema(
  {
    community: {
      type: String,
      required: true,
    },
    location: {
      type: [
        {
          placeId: {
            type: String,
            required: true,
          },
          placeDescription: {
            type: String,
            required: true,
          },
          lat: {
            type: String,
            required: true,
          },
          long: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    roomsCount: {
      type: Number,
      required: true,
    },
    houseArea: {
      type: String,
      required: true,
    },
    houseWidth: {
      type: String,
      required: true,
    },
    bathroomCount: {  
      type: Number,
      required: true,
    },
    lookingForCount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);