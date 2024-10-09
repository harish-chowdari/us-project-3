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
        // Assuming the response has a structure that contains listings directly
        setListings(response.data);
        console.log(response.data);
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
      <div>
        <h2>All Listings</h2>
        <input type="text" placeholder="Search..." className={Styles.search} />
      </div>
      {listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <ul className={Styles.list}>
          {listings.map((listing) => (
            <li key={listing._id} className={Styles.listItem}>
              <h3>{listing.community}</h3>
              <p>
                <strong>Address:</strong> {listing.location[0].placeDescription}
              </p>
              <p>
                <strong>Location:</strong> {listing.location[0].lat},
                {listing.location[0].long}
              </p>
              <p>
                <strong>Rooms Count:</strong> {listing.roomsCount}
              </p>
              <p>
                <strong>Description:</strong> {listing.description}
              </p>
              <p>
                <strong>House Area:</strong> {listing.houseArea}
              </p>
              <p>
                <strong>House Width:</strong> {listing.houseWidth}
              </p>
              <p>
                <strong>Bathroom Count:</strong> {listing.bathroomCount}
              </p>
              <p>
                <strong>Looking For Count:</strong> {listing.lookingForCount}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewListings;
