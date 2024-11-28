import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css"; // Import CSS module for styling
import { AllData } from "../Store/Store";

const Sidebar = () => {
  axios.defaults.withCredentials = true;
  const [isOpen, setIsOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const { adminAuth, handleSelectedTab } = useContext(AllData);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleTabClick = (tabName) => {
    onSelectTab(tabName);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowToggle(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = (e) => {
    axios
      .get("/logout")
      .then(() => {
        localStorage.clear();
        // window.location.href = "/";
        location.replace("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles["sidebar-toggle"]} onClick={toggleSidebar}>
        &#9776;
      </div>
      <ul className={styles["sidebar-menu"]}>
        <li
          onClick={() => handleSelectedTab("allRequest")}
          className={styles.sidename}
        >
          All verification request
        </li>
        <div className={styles.line}></div>
        <li
          onClick={() => handleSelectedTab("allFeedback")}
          className={styles.sidename}
        >
          Feedback
        </li>
        <div className={styles.line}></div>
        <li
          onClick={() => handleSelectedTab("allcompany")}
          className={styles.sidename}
        >
          View all Company
        </li>
      </ul>
      <div className={styles.line}></div>
      {adminAuth ? (
        <button className={`${styles.btn} mt-2`} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="login">
          <button className={`${styles.btn1} btn btn-primary   w-40 mt-2`}>
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
