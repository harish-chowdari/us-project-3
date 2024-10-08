import React, { useState } from "react";
import axiosInstance from "../../axios";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {
  const [suggestions, setSuggestions] = useState([]);

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

  const {
    community,
    location,
    placeId,
    placeDescription,
    lat,
    long,
    roomsCount,
    description,
    houseArea,
    houseWidth,
    bathroomCount,
    lookingForCount,
  } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !community ||
        !roomsCount ||
        !placeId ||
        !placeDescription ||
        !lat ||
        !long ||
        !description ||
        !houseArea ||
        !houseWidth ||
        !bathroomCount ||
        !lookingForCount
      ) {
        toast.dismiss();
        toast.error("Please fill all the fields");
        return;
      }

      console.log(formData);

      const response = await axiosInstance.post("/add-listing", formData);
      toast.dismiss();

      if (response.data.Added) {
        toast.success("Listing added successfully!");
      }
    } catch (error) {
      console.error("There was an error adding the listing!", error);
      toast.error("Error adding the listing. Try again.");
    }
  };

  const locationChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value,
    });
  };

  const handleSuggestionClick = async (suggestion) => {
    const selectedPlace = suggestions.find(s => s.description === suggestion);

    // Assuming `selectedPlace` has placeId and location (lat, long)
    if (selectedPlace) {
      setFormData({
        ...formData,
        location: selectedPlace.description,
        placeId: selectedPlace.placeId,
        placeDescription: selectedPlace.description,
        lat: selectedPlace.lat,
        long: selectedPlace.long
      });
      setSuggestions([]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { coords } = position;
          const { latitude, longitude } = coords;

          const locationString = `Lat: ${latitude}, Lon: ${longitude}`;
          setFormData({
            ...formData,
            location: locationString,
            lat: latitude,
            long: longitude,
          });

          autoCompletePlaces(latitude, longitude, "landmark")
            .then((data) => {
              // Mapping returned suggestions to include necessary info
              setSuggestions(
                data.predictions.map((place) => ({
                  description: place.description,
                  placeId: place.place_id,
                  lat: latitude, // if lat/long are constant for suggestions
                  long: longitude  // if lat/long are constant for suggestions
                }))
              );
            })
            .catch((error) => {
              console.error("Error fetching place data:", error);
            });
        },
        (error) => {
          toast.error("Could not retrieve location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  console.log(formData);

  async function autoCompletePlaces(lat, lon, query) {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?location=${lat},${lon}&input=${query}&api_key=keJsi8v9wvcTK6yiSujDT6bPZ3mzzYPYKDPKcGhx`,
        {
          headers: {
            "X-Request-Id": Math.random().toString(36).slice(2),
            "X-Correlation-Id": Math.random().toString(36).slice(2),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error in ola reverse geocoding with data ${query}`, error);
      throw error;
    }
  }

  return (
    <div className={Styles.container}>
      <h2 className={Styles.heading}>Add Listing</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
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
                  onClick={() => handleSuggestionClick(suggestion.description)}
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