const express = require("express");
const router = express.Router();


const { addListing, getAllListings, getPlaceDetails, getListingsBySearch, addHouseSearchHistory, addReview } = require("../Controllers/ListingsController");
const { uploadFile } = require("../s3");
const { bookUpload } = require("../multer");


 
router.get("/all-listings", getAllListings);
router.post("/add-listing",bookUpload, addListing);

router.post("/autocomplete", getPlaceDetails);

router.get("/all-listings/search", getListingsBySearch);

router.post("/listings-search-history", addHouseSearchHistory);

router.post("/add-review/:listingId", addReview);



module.exports = router;