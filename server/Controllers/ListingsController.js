const Listings = require("../Models/ListingsModel");

async function addListing(req, res) {
  const { community, location, roomsCount, description } = req.body;


  try {

    if (!community || !location || !roomsCount || !description) {
      return res
        .status(200)
        .json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new Listings({
      community,
      location,
      roomsCount,
      description,
      
    });
    const d = await data.save();
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
