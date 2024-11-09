import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Styles from "./viewCommunities.module.css";

const ViewCommunities = () => {
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

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get("/all-listings");
                setListings(response.data);
            } catch (err) {
                console.error("Error fetching listings", err);
                setError("No listings Found");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

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

            if(response.data){
                setSearchedListings(response.data.searchedListings);
                setSearchClicked(true);
                if(response.data.searchedListings){
                    const res = await axios.post("/communities-search-history", {
                        userId: localStorage.getItem("userId"),
                        roomsCount: roomCount,
                        bathroomCount: bathroomCount,
                        lookingForCount: lookingForCount,
                        distance: searchDistance,
                        price: priceRange,
                    });
    
                    console.log("community search history",res.data);
                }
            }
        } 
        
        catch (err) {
            console.error("Error fetching searched listings", err);
            setError("No listings Found");
        }
    };

    const listingsToDisplay = searchClicked ? searchedListings : listings;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2 className={Styles.title}>{searchClicked ? "Searched Communities" : "Communities"}</h2>
            </div>
            <div className={Styles.filters}>
                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={searchDistance}
                        onChange={(e) => setSearchDistance(e.target.value)}
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
                        onChange={(e) => setRoomCount(e.target.value)}
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
                        onChange={(e) => setBathroomCount(e.target.value)}
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
                        onChange={(e) => setLookingForCount(e.target.value)}
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
                        onChange={(e) => setPriceRange(e.target.value)}
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
                <ul className={Styles.list}>
                    {listingsToDisplay.map((listing) => (
                        <div key={listing._id} className={Styles.listItem}>
                            <h3 className={Styles.listItemTitle}>
                                {listing?.community}
                            </h3>
                            <img
                                className={Styles.listItemImage}
                                src={listing?.houseImage}
                                alt={listing?.community}
                            />
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
                            <p className={Styles.listItemDetails}>
                                <strong>Description:</strong>{" "}
                                {listing?.description}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Area:</strong>{" "}
                                {listing?.houseArea}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Width:</strong>{" "}
                                {listing?.houseWidth}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Bathroom Count:</strong>{" "}
                                {listing?.bathroomCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Looking For Count:</strong>{" "}
                                {listing?.lookingForCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Distance from UNT:</strong>{" "}
                                {(listing?.distance * 0.621371).toFixed(2)} miles
                            </p>
                        </div>
                    ))}
                </ul>
            ) : (
                <p className={Styles.noListings}>No listings found</p>
            )}
        </div>
    );
};

export default ViewCommunities;