const Listings = require("../Models/ListingsModel");

async function addListing(req, res) {
  const {
    community,
    location,
    placeId,
    placeDescription,
    lat,
    long,
    roomsCount,
    houseArea,
    houseWidth,
    bathroomCount,
    lookingForCount,
    description,
    distance,
  } = req.body;

  try {
   

    const loc = {
      placeId,
      placeDescription,
      lat,
      long,
    };

    if(!community || !location || !placeId || !placeDescription || !lat || !long || !roomsCount || !houseArea || !houseWidth || !bathroomCount || !lookingForCount || !description || !distance) {
      return res.json({ error: "Please fill all the fields" });
    }

    const data = new Listings({
      community,
      location:loc,
      roomsCount,
      description,
      houseArea,
      houseWidth,
      bathroomCount, 
      lookingForCount, 
      distance
    });
    const d = await data.save();
    if(d) {
      return res.status(200).json({ Added: "Listing added successfully" });
    }
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}

const getAllListings = async (req, res) => {
  try {
    const data = await Listings.find();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
};

const getListingById = async (req, res) => {
  try {
    const data = await Listings.findById(req.params.id);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addListing,
  getAllListings,
  getListingById,
};
