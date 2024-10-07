import React, { useEffect, useState } from "react";
import axios from "../../axios"; 
import Styles from "./ViewListings.module.css"; 

const ViewListings = () => {
  const [listings, setListings] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      

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

  return (
    <div className={Styles.container}>
      <h2>All Listings</h2>
      {listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <ul className={Styles.list}>
          {listings.map((listing) => (
            <li key={listing._id} className={Styles.listItem}>
              <h3>{listing.community}</h3>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Rooms Count:</strong> {listing.roomsCount}</p>
              <p><strong>Description:</strong> {listing.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewListings;
