import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../axios";
import Styles from "./ViewListings.module.css";
import { ToastContainer, toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

// Custom Marker Icon
const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapWithClick = ({ setCoordinates }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setCoordinates({ lat, lng });
        },
    });

    return null;
};

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [coordinates, setCoordinates] = useState(null); // Selected coordinates
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={Styles.container}>
            <h2 className={Styles.title}>Listings with Map</h2>

            <MapContainer
                center={[51.505, -0.09]} // Default center of the map
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapWithClick setCoordinates={setCoordinates} />
                {coordinates && (
                    <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
                        <Popup>
                            Selected Location: <br />
                            Latitude: {coordinates.lat.toFixed(4)} <br />
                            Longitude: {coordinates.lng.toFixed(4)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className={Styles.listings}>
                {listings.map((listing) => (
                    <div key={listing._id} className={Styles.listItem}>
                        <h3>{listing.community}</h3>
                        <p>
                            Address: {listing?.location[0]?.placeDescription || "N/A"}
                        </p>
                        <button
                            onClick={() =>
                                setCoordinates({
                                    lat: listing.location[0]?.latitude,
                                    lng: listing.location[0]?.longitude,
                                })
                            }
                        >
                            View on Map
                        </button>
                    </div>
                ))}
            </div>

            <ToastContainer autoClose={3000} position="top-center" />
        </div>
    );
};

export default Map;
