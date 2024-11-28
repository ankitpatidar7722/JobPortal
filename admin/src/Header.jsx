import { useContext, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./header.css";
import axios from "axios";
import { Link } from "react-router-dom";
import style from "./header.module.css";

import { AllData } from "./Component/Store/Store";

function Header() {
  axios.defaults.withCredentials = true;
  const navRef = useRef();
  const { adminAuth } = useContext(AllData);
  const handleLogout = () => {
    axios
      .get("/logout")
      .then(() => {
        localStorage.clear();
        location.replace("/");
      })
      .catch((err) => console.log(err));
  };

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  return (
    <header className={style.nav}>
      <div>
        <Link to="/">
          <div className={style.logo}>
            <h3>
              <img
                src="/Mainicon.png"
                className=" h-[200px] w-[250px] "
                alt="Main Icon"
              />
            </h3>
          </div>
        </Link>
      </div>
      <div className="flex justify-end mr-0">
        <nav ref={navRef}>
          {adminAuth && (
            <button className={style.btn} onClick={handleLogout}>
              Logout
            </button>
          )}

          {!adminAuth && (
            <Link to="login">
              <button className={`${style.btn} w-40`}>Login</button>
            </Link>
          )}
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </div>
    </header>
  );
}

export default Header;
