const Listings = require("../Models/ListingsModel");
const axios = require("axios"); 


async function addListing(req, res) {
  const {
    community,
    location,
    placeId,
    placeDescription,
    lat,
    long,
    roomsCount,
    price,
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

    if(!community || !location || !placeId || !placeDescription || !lat || !long || !roomsCount || !price || !houseArea || !houseWidth || !bathroomCount || !lookingForCount || !description || !distance) {
      return res.json({ error: "Please fill all the fields" });
    }

    const data = new Listings({
      community,
      location:loc,
      roomsCount,
      price,
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


const getPlaceDetails = async (req, res) => {
  try {
      const { input, location, radius } = req.body;

        // if (!input) {
        //     return res.status(200).send({ input: "Input is required" });
        // }

        // if (!location) {
        //     return res.status(200).send({ location: "Location is required" });
        // }

        // if (!radius) {
        //     return res.status(200).send({ radius: "Radius is required" });
        // }

      const autocompleteResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
              params: {
                  input,
                  key: 'AIzaSyCRebFx8wnznVAWqDh9cVKcBlwvP0esKio',
                  ...(location && { location: `${location.lat},${location.lng}` }), // Adds location if provided
                  ...(radius && { radius }), // Adds radius if provided
                  types: 'establishment'
              },
          }
      );

      const placeDetails = await Promise.all(
          autocompleteResponse.data.predictions.map(async (prediction) => {
              const detailsResponse = await axios.get(
                  `https://maps.googleapis.com/maps/api/place/details/json`,
                  {
                      params: {
                          place_id: prediction.place_id,
                          key: 'AIzaSyCRebFx8wnznVAWqDh9cVKcBlwvP0esKio',
                      },
                  }
              );

              const { result } = detailsResponse.data;
              return { description: prediction.description, location: result.geometry.location, place_id: prediction.place_id };
          })
      );

      res.json(placeDetails);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
  }
}


module.exports = {
  addListing,
  getAllListings,
  getListingById,
  getPlaceDetails
};
