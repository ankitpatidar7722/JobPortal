import React, { useContext, useState } from "react";
import style from "./Search.module.css";
import { AllFunction } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Search() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { handleSearch, search, handleAllJobs } = useContext(AllFunction);
  // State variables to store selected values
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedJobLocation, setSelectedJobLocation] = useState("");

  const handleSearch1 = () => {
    if (selectedJobLocation === "" || selectedJobType === "") {
      alert("please select both feild");
    } else {
      handleSearch({ job: selectedJobType, city: selectedJobLocation });
      axios
        .post("/getSearchData", {
          job: selectedJobType,
          city: selectedJobLocation,
        })
        .then((res) => {
          if (res.data.Status === "done") {
            handleAllJobs(res.data.jobs);
            navigate("/AllJobs");
          }
        });
    }
  };
  return (
    <>
      <div className="flex flex-col w-[60%] mx-5 justify-center items-center lg:flex-row border-solid left-[50%] border-4 p-1 m-5 rounded-xl bg-slate-200 shadow-xl">
        <div className="flex flex-col lg:flex-row w-full lg:w-2/3">
          <select
            className="py-1 px-1 rounded-md p-6 font-bold text-2xl lg:w-1/2 lg:mr-5"
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Job Type
            </option>
            <option value="SDE">SDE</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="MERN Developer">MERN Developer</option>
            <option value="Backed Developer">Backend Developer</option>
            <option value="Java full stack developer">
              Java full stack developer
            </option>
          </select>
          <div>
            <br />
          </div>
          <select
            className="py-1 px-1 rounded-md p-6 font-bold text-2xl lg:w-1/2"
            value={selectedJobLocation}
            onChange={(e) => setSelectedJobLocation(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Job Location
            </option>
            <option value="Indore">Indore</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Pune">Pune</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>
        <div className="flex justify-center lg:justify-center w-[80%] lg:w-1/3 mt-3 lg:mt-0">
          <button className={style.btn} onClick={handleSearch1}>
            SEARCH HERE!
          </button>
        </div>
      </div>
    </>
  );
}

export default Search;
