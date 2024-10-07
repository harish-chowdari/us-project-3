const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    
    community: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    roomsCount: {
        type: Number,
        required: true,
    },
    description: {  
        type: String,
        required: true, 
    }
}, {timestamps: true});

module.exports = mongoose.model("Listing", ListingSchema);