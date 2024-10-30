import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Styles from './Sidebar.module.css';

const Sidebar = () => {
  const userId = localStorage.getItem("userId");

  // if url contains home/${userId}/add-listings then hide the add listing button
  const view = window.location.pathname.includes("/home/" + userId + "/view-listings")

  const add = window.location.pathname.includes("/home/" + userId + "/add-listings")
 

  return (
    <div className={Styles.container}>
      <div className={Styles.sidebar}>
      {/* add home  */}
      <NavLink to={`/home`} className={({ isActive }) => (isActive ? Styles.activeLink : Styles.link)}>Home</NavLink>
        {!view && <NavLink 
          to={`/home/${userId}/add-listings`} 
          className={({ isActive }) => (isActive ? Styles.activeLink : Styles.link)}
        >
          Add Listing
        </NavLink>}

        {!add && <NavLink 
          to={`/home/${userId}/view-listings`} 
          className={({ isActive }) => (isActive ? Styles.activeLink : Styles.link)}
        >
          View Listings
        </NavLink>}

        <div className={Styles.spacer}></div>
        
        <Link to="/" onClick={() => localStorage.removeItem("userId")} className={Styles.logout}>Logout</Link>
      </div>
    </div>
  );
};

export default Sidebar;
