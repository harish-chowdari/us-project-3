import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Styles from "./viewCommunities.module.css";
import { ToastContainer, toast } from "react-toastify";
import {FaStar, FaMapMarkerAlt} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



// Fix marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ViewCommunities = () => {

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [listings, setListings] = useState([]);
    const [searchedListings, setSearchedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchDistance, setSearchDistance] = useState("");
    const [roomCount, setRoomCount] = useState("");
    const [bathroomCount, setBathroomCount] = useState("");
    const [lookingForCount, setLookingForCount] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    const [ratedListing, setRatedListing] = useState(false);

    const [defaultLat, setDefaultLat] = useState(0);
    const [defaultLong, setDefaultLong] = useState(0);




const MapUpdater = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 13); 
        }
    }, [lat, lng, map]);
    return null;
};

    const handleLocationView = (lat,long) => {
        setDefaultLat(lat)
        setDefaultLong(long)
        console.log(lat,long)
    }

    
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get("/all-communities");
                setListings(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching listings", err);
                setError("No listings Found");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);


    const handleViewListing = (listingId) => {
        navigate(`/home/${userId}/view-community/${listingId}`);
    }

    const handleSearch = async () => {
        try {
            const response = await axios.get("/all-communities/search", {
                params: {
                    roomsCount: roomCount,
                    bathroomCount: bathroomCount,
                    lookingForCount: lookingForCount,
                    distance: searchDistance,
                    price: priceRange,
                },
            });

            if (response.data) {
                setSearchedListings(response.data.searchedListings);
                setSearchClicked(true);
                console.log(response.data);
                if (response.data.searchedListings) {
                    const res = await axios.post("/communities-search-history", {
                        userId: localStorage.getItem("userId"),
                        roomsCount: roomCount,
                        bathroomCount: bathroomCount,
                        lookingForCount: lookingForCount,
                        distance: searchDistance,
                        price: priceRange,
                    });

                    console.log(res.data);
                }
            }
        } catch (err) {
            console.error("Error fetching searched listings", err);
            setError("No listings Found");
        }
    };


    const handleUpdateSearchHistory = async () => {
        try {
            const filters = {};
    
            const res = await axios.post("/communities-search-history", {
                userId: localStorage.getItem("userId"),
                roomsCount: roomCount,
                bathroomCount: bathroomCount,
                lookingForCount: lookingForCount,
                distance: searchDistance,
                price: priceRange,
            });

            console.log(res.data);
        } catch (err) {
            console.error("Error updating search history", err);
        }
    };

    const listingsToDisplay = searchClicked ? searchedListings : listings;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;



    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2 className={Styles.title}>
                    {searchClicked ? "Searched Listings" : "Listings"}
                </h2>
            </div>
            <div className={Styles.filters}>
                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={searchDistance}
                        onChange={(e) => {
                             
                            setSearchDistance(e.target.value)
                            handleUpdateSearchHistory();
                            }}
                    >
                        <option value="">Distance</option>
                        <option value="5">Below 5 miles</option>
                        <option value="10">Below 10 miles</option>
                        <option value="15">Below 15 miles</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={roomCount}
                        onChange={(e) => {
                             
                            setRoomCount(e.target.value)
                            handleUpdateSearchHistory();
                            }}
                    >
                        <option value="">Room Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={bathroomCount}
                        onChange={(e) => {
                            setBathroomCount(e.target.value)
                            handleUpdateSearchHistory();
                            }}
                    >
                        <option value="">Bathroom Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={lookingForCount}
                        onChange={(e) => {
                            setLookingForCount(e.target.value)
                            handleUpdateSearchHistory();
                            }}
                    >
                        <option value="">Looking For Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={priceRange}
                        onChange={(e) => {
                            setPriceRange(e.target.value)
                            handleUpdateSearchHistory();
                            }}
                    >
                        <option value="">Price Range</option>
                        {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={(i + 1) * 100}>
                                Below ${(i + 1) * 100}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch}>Search</button>
            </div>

            {listingsToDisplay && listingsToDisplay.length > 0 ? (
                <div className={Styles.listContainer}>
                <ul className={Styles.list}>
                    {listingsToDisplay.map((listing) => (
                        <div key={listing._id} className={Styles.listItem}>
                            <div className={Styles.listItemDetailsDiv}>
                                <div className={Styles.listItemTitleDiv1}>
                                    <h3 className={Styles.listItemTitle}>
                                        {listing?.community}
                                    </h3>
                                    <img
                                        className={Styles.listItemImage}
                                        src={listing?.houseImage}
                                        alt={listing?.community}
                                    />
                                   
                                    
                                </div>
                                <div className={Styles.listItemDetailsDiv2}>
                                    <p className={Styles.listItemDetails}>
                                        <strong>Address:</strong>{" "}
                                        {listing?.location[0]?.placeDescription}
                                    </p>
                                    <p className={Styles.listItemDetails}>
                                        <strong>Rooms Count:</strong>{" "}
                                        {listing?.roomsCount}
                                    </p>
                                    <p className={Styles.listItemDetails}>
                                        <strong>Price:</strong> ${listing?.price}
                                    </p>

                                    <div className={Styles.listItemDetails0}>
                                        <span className={Styles.listItemDetailsP} style={{ marginRight: "2px", marginTop: "7px", fontSize: "12px" }}>
                                            {listing?.reviews && listing?.reviews.length > 0
                                                ? (
                                                    listing.reviews.reduce((sum, review) => sum + review.rating, 0) /
                                                    listing.reviews.length
                                                ).toFixed(1)
                                                : "No ratings"}

                                        </span>    
                                        <span style={{marginTop:"5px"}}>({listing?.reviews && listing?.reviews.length })</span>
                                            
                                        <FaMapMarkerAlt size={17} style={{ color: "blue", cursor: "pointer", marginTop: "5px", marginLeft: "7px" }} onClick={() => handleLocationView(listing.location[0].lat, listing.location[0].long)}>Location</FaMapMarkerAlt>

                                        </div>    
                                        <span className={Styles.viewButton} onClick={() => handleViewListing(listing._id)}>View More</span>              
                                    

                                    {/* <p className={Styles.listItemDetails}>
                                        <strong>Distance from UNT:</strong>{" "}
                                        {(listing?.distance * 0.621371).toFixed(2)}{" "}
                                        miles
                                    </p> */}

                                </div>
                            </div>
                            {/* <div className={Styles.reviewContainer}>
                                <h3 className={Styles.reviewTitle}>Review Here</h3>
                            <div className={Styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size={20}
                                            color={index < (rating[listing._id] || 0) ? "#ffc107" : "#e4e5e9"}
                                            onClick={() => renderStars(listing._id, index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
                                {rating[listing._id] ? emojiReactions[rating[listing._id] - 1] : rating[listing._id]}
                                </div>
                                <textarea
                                    placeholder="Feedback"
                                    value={feedback[listing._id] || ""}
                                    onChange={(e) =>
                                        setFeedback((prevFeedbacks) => ({
                                            ...prevFeedbacks,
                                            [listing._id]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    className={Styles.reviewButton}
                                    onClick={() => handleReview(listing._id)}
                                >
                                    Rate
                                </button>
                            </div> */}
                        </div>
                    ))}
                </ul>

                    <div className={Styles.mapContainer}>
                    
                        <MapContainer
                            center={[defaultLat || 33.207488, defaultLong || -97.1525862]} // Default center if no location is selected
                            zoom={defaultLat && defaultLong ? 13 : 5} // Zoom closer if a location is selected
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapUpdater lat={defaultLat} lng={defaultLong} />

                            {/* Render all markers if no specific location is selected */}
                            {(!defaultLat && !defaultLong) &&
                                listingsToDisplay.map((listing) => (
                                    <Marker
                                        key={listing._id}
                                        position={[
                                            listing.location[0].lat,
                                            listing.location[0].long,
                                        ]}
                                    >
                                        <Popup>
                                            <strong>{listing.community}</strong>
                                            <br />
                                            {listing.location[0].placeDescription}
                                        </Popup>
                                    </Marker>
                                ))}

                            {/* Render only the selected marker */}
                            {(defaultLat && defaultLong) && (
                                <Marker position={[defaultLat, defaultLong]}>
                                    <Popup>
                                        {defaultLat},{" "}
                                        {defaultLong}
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>

                </div>


            ) : (
                <p className={Styles.noListings}>No listings found</p>
            )}
            <ToastContainer autoClose={3000} position="top-center" />
        </div>
    );
};

export default ViewCommunities;
