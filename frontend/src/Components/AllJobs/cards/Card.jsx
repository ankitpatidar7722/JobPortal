import { useState, useContext } from "react";
import style from "./Card.module.css";
import { AiFillAmazonSquare } from "react-icons/ai";
import { MdHomeFilled } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { Link } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";
import { AllFunction } from "../../store/store";
export default function Card({ obj }) {
  const companyName = obj.CompName;
  const jobRole = obj.JobTitle;
  const jobType = obj.workLocation;
  const city = obj.City;
  const jobTIme = obj.JobType;
  const minimum = obj.Salary;
  const logo = obj.companyLogo;
  const { userAuth } = useContext(AllFunction);
  return (
    <div className={style.card}>
      <div className={`d-flex justify-content-between ${style.header}`}>
        <div className="flex space-x-2 ">
          <div>
            {/* <AiFillAmazonSquare size={50} /> */}
            <img src={logo} className={style.image}></img>
          </div>

          <div className={style.company}>
            <h1 className="fs-5">{jobRole}</h1>
            <p className="fs-6 pt-1">{companyName}</p>
          </div>
        </div>
        <div>
          <Link to={userAuth === true ? `apply/:${obj.JobId}` : "/login"}>
            <button className={style.closeButton}>
              <SlArrowRight />
            </button>
          </Link>
        </div>
      </div>
      <div className="d-flex align-items-center ms-2">
        <FaWallet className="me-2 mt-1" />
        <p className="mb-0 mt-1">₹{minimum}</p>
      </div>
      <div className="d-flex">
        <div className="d-flex align-items-center mt-2 ms-1">
          <MdHomeFilled size={20} />
          <p className="ps-2 mb-0 fs-6">{jobType}</p>
        </div>
        <div
          className="d-flex align-items-center mt-2 ms-5"
          style={{ marginRight: "100px" }}
        >
          <MdLocationPin size={20} />
          <p className="ps-2 mb-0 fs-6">{city}</p>
        </div>
      </div>

      <div className={style.time}>
        <p className="me-2 ms-1">{jobTIme}</p>
        <p className="ms-2">Test required</p>
      </div>
      <div className={style.extra}>
        <p className="me-1">Urgently hiring</p>
        <p className="ms-2">Fast HR reply</p>
      </div>
    </div>
  );
}
