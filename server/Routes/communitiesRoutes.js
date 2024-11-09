const express = require("express");
const { getCommunities, addCommunitySearchHistory } = require("../Controllers/communitiescontroller");
const { addHouseSearchHistory, getListingsBySearch } = require("../Controllers/ListingsController");
const router = express.Router();


router.get('/all-communities', getCommunities);


router.get("/all-communities/search", getListingsBySearch);

router.post("/communities-search-history", addCommunitySearchHistory);

module.exports = router 