import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Styles from "./ViewListings.module.css";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDistance, setSearchDistance] = useState(""); 

  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/all-listings");
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings", err);
        setError("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredListings = listings.filter((listing) => {
    const enteredDistance = parseFloat(searchDistance);
    return isNaN(enteredDistance) || listing.distance <= enteredDistance;
  });

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2 className={Styles.title}>All Listings</h2>
        <input
          type="number"
          placeholder="Search by distance (km)"
          value={searchDistance}
          onChange={(e) => setSearchDistance(e.target.value)} e
          className={Styles.search}
        />
      </div>
      {filteredListings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <ul className={Styles.list}>
          {filteredListings.map((listing) => (
            <li key={listing._id} className={Styles.listItem}>
              <h3 className={Styles.listItemTitle}>
                {listing.community} (community)
              </h3>
              <p className={Styles.listItemDetails}>
                <strong>Address:</strong> {listing.location[0].placeDescription}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>Rooms Count:</strong> {listing.roomsCount}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>Description:</strong> {listing.description}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>House Area:</strong> {listing.houseArea}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>House Width:</strong> {listing.houseWidth}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>Bathroom Count:</strong> {listing.bathroomCount}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>Looking For Count:</strong> {listing.lookingForCount}
              </p>
              <p className={Styles.listItemDetails}>
                <strong>Distance from UNT:</strong> {listing.distance} Km
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewListings;