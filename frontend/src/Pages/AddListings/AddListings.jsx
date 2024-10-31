import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        lat: null,
        lon: null,
    });
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [distanceFromUNT, setDistanceFromUNT] = useState(null);

    const untUniversitycords = {
        lat: 33.207488,
        lon: -97.1525862,
    };

    const [formData, setFormData] = useState({
        community: "",
        location: "",
        placeId: "",
        placeDescription: "",
        lat: "",
        long: "",
        roomsCount: "",
        price: "",
        houseArea: "",
        houseWidth: "",
        bathroomCount: "",
        lookingForCount: "",
        description: "",
    });

    const {
        community,
        location,
        placeId,
        placeDescription,
        lat,
        long,
        bathroomCount,
        houseArea,
        houseWidth,
        lookingForCount,
        roomsCount,
        price,
        description,
    } = formData;

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lon: longitude });
                },
                (error) => {
                    toast.error(
                        "Could not retrieve location: " + error.message
                    );
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const locationChange = async (e) => {
        const value = e.target.value;
        setFormData({ ...formData, location: value });

        if (currentLocation.lat && currentLocation.lon && value.trim() !== "") {
            const data = {
                input: value,
                location: {
                    lat: currentLocation.lat,
                    lng: currentLocation.lon,
                },

                radius: 1000,
            };
            try {
                const response = await axiosInstance.post("/autocomplete", {
                    ...data,
                });
                if (response.data.length) {
                    setSuggestions(response.data);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching place data:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuggestionClick = (suggestion) => {
        const { lat, lng } = suggestion.location;

        setFormData({
            ...formData,
            location: suggestion.description,
            lat: lat,
            long: lng,
            placeId: suggestion.place_id,
            placeDescription: suggestion.description,
        });

        // Calculate distance from UNT
        const distance = calculateDistance(
            untUniversitycords.lat,
            untUniversitycords.lon,
            lat,
            lng
        );
        setDistanceFromUNT(distance * 0.621371);

        setSelectedPrediction(suggestion);
        setSuggestions([]);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (value) => (value * Math.PI) / 180;

        const earthRadius = 6371; // Radius of the Earth in kilometers

        const lat1Rad = toRadians(lat1);
        const lon1Rad = toRadians(lon1);
        const lat2Rad = toRadians(lat2);
        const lon2Rad = toRadians(lon2);

        const latDiff = lat2Rad - lat1Rad;
        const lonDiff = lon2Rad - lon1Rad;

        const a =
            Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(lat1Rad) *
                Math.cos(lat2Rad) *
                Math.sin(lonDiff / 2) *
                Math.sin(lonDiff / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = earthRadius * c;
        return distanceKm.toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
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
            distance: distanceFromUNT,
        };

        try {
            const response = await axiosInstance.post(
                "/add-listing",
                dataToSend
            );
            if (response.data.error) {
                toast.error(response.data.error);
                return;
            }

            toast.success("Listing added successfully!");
        } catch (error) {
            toast.error(
                "Error adding listing: " + error.response?.data?.message ||
                    error.message
            );
        }
    };

    return (
        <div className={Styles.container}>
            <h2 className={Styles.heading}>Add Listing</h2>
            <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Community:</label>
                    <input
                        type="text"
                        name="community"
                        value={community}
                        onChange={handleInputChange}
                        className={Styles.input}
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={location}
                        autoComplete="off"
                        onFocus={getCurrentLocation}
                        onChange={locationChange}
                        className={Styles.input}
                    />
                    {suggestions.length > 0 && (
                        <ul className={Styles.suggestionsList}>
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={Styles.suggestionItem}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                >
                                    {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {distanceFromUNT && (
                    <div className={Styles.distanceInfo}>
                        Distance from UNT: {distanceFromUNT.toFixed(2)} miles
                    </div>
                )}

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>House Area:</label>
                    <input
                        type="number"
                        name="houseArea"
                        value={houseArea}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>House Width:</label>
                    <input
                        type="number"
                        name="houseWidth"
                        value={houseWidth}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Bathroom Count:</label>
                    <input
                        type="number"
                        name="bathroomCount"
                        value={bathroomCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Looking For Count:</label>
                    <input
                        type="number"
                        name="lookingForCount"
                        value={lookingForCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Rooms Count:</label>
                    <input
                        type="number"
                        name="roomsCount"
                        value={roomsCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="1"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Price in $:</label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="1"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Description:</label>
                    <textarea
                        rows="4"
                        type="text"
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        className={Styles.input}
                    />
                </div>

                <button type="submit" className={Styles.submitButton}>
                    Add Listing
                </button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default AddListing;
