const express = require("express");
const router = express.Router();


const { addListing, getAllListings, getPlaceDetails } = require("../Controllers/ListingsController");



router.get("/all-listings", getAllListings);
router.post("/add-listing", addListing);

router.post("/autocomplete", getPlaceDetails);



module.exports = router;