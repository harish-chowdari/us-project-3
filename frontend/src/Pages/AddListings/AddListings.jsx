import React, { useState } from "react";
import axios from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {
  const [formData, setFormData] = useState({
    community: "",
    location: "",
    roomsCount: "",
    houseArea: "",
    houseWidth: "",
    BathRoomCount: "",
    lookingForCount: "",
    description: "",
  });

  const {
    community,
    location,
    roomsCount,
    description,
    houseArea,
    houseWidth,
    BathRoomCount,
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
        !location ||
        !roomsCount ||
        !description ||
        !houseArea ||
        !houseWidth ||
        !BathRoomCount ||
        !lookingForCount
      ) {
        toast.dismiss();
        toast.error("Please fill all the fields");
        return;
      }

      const response = await axios.post("/add-listing", formData);
      toast.dismiss();

      if(response.data.Added) {

      toast.success("Listing added successfully!");
      }
      
    } catch (error) {
      console.error("There was an error adding the listing!", error);
      toast.error("Error adding the listing. Try again.");
    }
  };

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
            onChange={handleInputChange}
            className={Styles.input}
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
          <label className={Styles.label}>Bath Room Count:</label>
          <input
            type="number"
            name="BathRoomCount"
            value={BathRoomCount}
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
