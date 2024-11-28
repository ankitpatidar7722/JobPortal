import React, { useContext, useState } from "react";
import style from "./Filter.module.css";
import axios from "axios";
import { AllFunction } from "../store/store";
export default function Filter() {
  axios.defaults.withCredentials = true;
  const [workType, setWorkType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const { handleAllJobs } = useContext(AllFunction);
  const handleApply = () => {
    if (workType === "" || workMode === "" || location === "") {
      alert("Please select remaining fields");
    } else {
      axios
        .post("/filterdata", { workType, workMode, location })
        .then((res) => {
          if (res.data.Status === "done") {
            handleAllJobs(res.data.jobs);
            console.log(res.data);
          }
        });
    }
  };

  const handleClear = () => {
    axios.get("/allJobs").then((res) => {
      if (res.data.Status === "Success") {
        console.log(res.data.jobs);
        const jobs = res.data.jobs;
        jobs.reverse();
        handleAllJobs(jobs);
      }
    });
    setWorkType("");
    setWorkMode("");
    setLocation("");
  };

  return (
    <div className={style.filter}>
      <h1 className="fs-4 p-2">Filter</h1>
      <hr />
      {/* Work Type */}
      <h2 className="mt-2 ms-1 fw-bold">Work Type</h2>
      <input
        type="radio"
        className="ms-1 mt-1"
        name="workType"
        id="partTime"
        checked={workType === "Part time"}
        onChange={() => setWorkType("Part time")}
      />
      <label htmlFor="partTime" className="ms-1 mt-1">
        Part time
      </label>
      <br />
      <input
        type="radio"
        className="ms-1 mt-1"
        name="workType"
        id="fullTime"
        checked={workType === "Full time"}
        onChange={() => setWorkType("Full time")}
      />
      <label htmlFor="fullTime" className="ms-1 mt-1">
        Full time
      </label>

      {/* Work Mode */}
      <h2 className="mt-2 ms-1 fw-bold">Work Mode</h2>
      <input
        type="radio"
        className="ms-1 mt-1"
        name="workMode"
        id="remote"
        checked={workMode === "Remote"}
        onChange={() => setWorkMode("Remote")}
      />
      <label htmlFor="remote" className="ms-1 mt-1">
        Remote
      </label>
      <br />
      <input
        type="radio"
        className="ms-1 mt-1"
        name="workMode"
        id="officeWork"
        checked={workMode === "Office"}
        onChange={() => setWorkMode("Office")}
      />
      <label htmlFor="officeWork" className="ms-1 mt-1">
        Office
      </label>

      {/* Location */}
      <h2 className="mt-2 ms-1 fw-bold">Location</h2>
      <select
        className="form-select mt-3 ms-2"
        style={{ width: "220px", padding: "3px" }}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="" hidden>
          All
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

      {/* Apply and Clear Buttons */}
      <div className="d-flex mt-2 ms-2">
        <button className="btn btn-primary me-3 w-[30%]" onClick={handleApply}>
          Apply
        </button>
        <button className="btn btn-secondary w-[30%]" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
