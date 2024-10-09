import React, { useState } from "react";
import axiosInstance from "../../axios";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [distance, setDistance] = useState(null); 
  const [shouldShowDistance, setShouldShowDistance] = useState(false);

  const untUniversityCords = {
    lat: 33.210880,
    long: -97.147827,
  };

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
    distance: "",
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
    distance: calculatedDistance,
  } = formData;

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180; // Convert degrees to radians
    const R = 6371; // Earth radius in km

    const latDistance = toRad(coords2.lat - coords1.lat);
    const longDistance = toRad(coords2.long - coords1.long);

    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
      Math.sin(longDistance / 2) * Math.sin(longDistance / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateDistance();
  
    // Include distance in form data if it's calculated
    const updatedFormData = {
      ...formData,
      distance: distance ? distance.toFixed(2) : "", // Add distance to formData
    };
  
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
  
      console.log(updatedFormData);
      const response = await axiosInstance.post("/add-listing", updatedFormData);
      toast.dismiss();
  
      if (response.data.Added) {
        toast.success("Listing added successfully!");
        setShouldShowDistance(true); 
      }
    } catch (error) {
      console.error("There was an error adding the listing!", error);
      toast.error("Error adding the listing. Try again.");
    }
  };
  

  const calculateDistance = () => {
    if (!lat || !long) {
      toast.error("Please enter latitude and longitude to calculate distance");
      return;
    }

    const calculatedDistance = haversineDistance(
      untUniversityCords,
      { lat: parseFloat(lat), long: parseFloat(long) }
    );

    setDistance(calculatedDistance); 
    setShouldShowDistance(true); 
  };

  const locationChange = (e) => {
    const { value } = e.target;

    setFormData({
      ...formData,
      location: value,
    });

    if (value) {
      autoCompletePlaces(lat, long, value)
        .then((data) => {
          setSuggestions(
            data.predictions.map((place) => ({
              description: place.description,
              placeId: place.place_id,
              lat: lat,
              long: long,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching place data:", error);
        });
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const selectedPlace = suggestions.find(s => s.description === suggestion);

    if (selectedPlace) {
      setFormData({
        ...formData,
        location: selectedPlace.description,
        placeId: selectedPlace.placeId,
        placeDescription: selectedPlace.description,
        lat: selectedPlace.lat,
        long: selectedPlace.long,
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

          setFormData({
            ...formData,
            lat: latitude,
            long: longitude,
          });

          autoCompletePlaces(latitude, longitude, "landmark")
            .then((data) => {
              if (!data.predictions.length) {
                setSuggestions([]);
              }
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

        <button onClick={calculateDistance} type="submit" className={Styles.submitButton}>
          Add Listing
        </button>
      </form>


      {shouldShowDistance && distance !== null && (
        <div className={Styles.distanceInfo}>
          Distance from Unt University: {distance.toFixed(2)} km
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddListing;
