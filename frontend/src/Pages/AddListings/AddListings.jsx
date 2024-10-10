import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const [formData, setFormData] = useState({
    community: "",
    location: "",
    placeId: "",
    placeDescription: "",
    lat: "",
    long: "",
    roomsCount: "",
    houseArea: "",
    houseWidth: "",
    bathroomCount: "",
    lookingForCount: "",
    description: "",
  });

  const { community, location, placeId, placeDescription, lat, long, bathroomCount, houseArea, houseWidth, lookingForCount, roomsCount, description } = formData;

  // Function to fetch current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          toast.error("Could not retrieve location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Function to handle location input changes and trigger autocomplete API
  const locationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (currentLocation.lat && currentLocation.lon && value.trim() !== "") {
      autoCompletePlaces(currentLocation.lat, currentLocation.lon, value)
        .then((data) => {
          if (data.predictions.length) {
            setSuggestions(data.predictions);
          } else {
            setSuggestions([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching place data:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Autocomplete places API call
  async function autoCompletePlaces(lat, lon, query) {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?location=${lat},${lon}&input=${query}&api_key=keJsi8v9wvcTK6yiSujDT6bPZ3mzzYPYKDPKcGhx`,
        {
          headers: {
            "X-Request-Id": Math.random().toString(36).slice(2),
            "X-Correlation-Id": Math.random().toString(36).slice(2),
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error in ola reverse geocoding with data ${query}`, error);
      throw error;
    }
  }

  // Function to handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle suggestion click and extract latitude and longitude
  const handleSuggestionClick = (suggestion) => {
    const { lat, lng } = suggestion.geometry.location;

    setFormData({
      ...formData,
      location: suggestion.description,
      lat: lat,
      long: lng,
      placeId: suggestion.place_id,
      placeDescription: suggestion.description,
    });

    console.log(suggestion);

    setSelectedPrediction(suggestion);
    setSuggestions([]);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data to send to the backend
    const dataToSend = {
      community,
      location,
      placeId,
      placeDescription,
      lat,
      long,
      roomsCount,
      houseArea,
      houseWidth,
      bathroomCount,
      lookingForCount,
      description,
    };

    try {
      const response = await axiosInstance.post('/add-listing', dataToSend);
      toast.success("Listing added successfully!");
      // Optionally reset the form or perform other actions after success
      
    } catch (error) {
      toast.error("Error adding listing: " + error.response?.data?.message || error.message);
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
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
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
          <label className={Styles.label}>Bathroom Count:</label>
          <input
            type="number"
            name="bathroomCount"
            value={bathroomCount}
            onChange={handleInputChange}
            className={Styles.input}
            min="1"
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>House Area:</label>
          <input
            type="text"
            name="houseArea"
            value={houseArea}
            onChange={handleInputChange}
            className={Styles.input}
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>House Width:</label>
          <input
            type="text"
            name="houseWidth"
            value={houseWidth}
            onChange={handleInputChange}
            className={Styles.input}
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
            min="1"
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>Description:</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            className={Styles.textarea}
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
