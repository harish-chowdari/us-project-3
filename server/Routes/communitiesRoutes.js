const express = require("express");
const { getCommunities } = require("../Controllers/communitiescontroller");
const router = express.Router();


router.get('/all-communities', getCommunities);

module.exports = router 