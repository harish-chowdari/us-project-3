const express = require("express");
const { getCommunities, addCommunitySearchHistory, addReview } = require("../Controllers/communitiescontroller");
const { addHouseSearchHistory, getListingsBySearch } = require("../Controllers/ListingsController");
const router = express.Router();


router.get('/all-communities', getCommunities);


router.get("/all-communities/search", getListingsBySearch);

router.post("/communities-search-history", addCommunitySearchHistory);

router.post("/add-review/:listingId", addReview);


module.exports = router 