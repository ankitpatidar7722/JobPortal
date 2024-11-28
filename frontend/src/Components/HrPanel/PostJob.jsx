import React, { useState, useContext } from "react";
import "./PostJob.css"; // Import custom CSS file
import axios from "axios";
import { AllFunction } from "../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    experience: "",
    minimumEducation: "",
    city: "",
    role: "",
    salary: "",
    jobType: "",
    workLocation: "",
    lastDate: "",
  });
  const { addHrPostJob } = useContext(AllFunction);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const {
      jobTitle,
      jobDescription,
      experience,
      minimumEducation,
      city,
      role,
      salary,
      jobType,
      workLocation,
      lastDate,
    } = formData;

    if (
      !jobTitle ||
      !jobDescription ||
      !experience ||
      !minimumEducation ||
      !city ||
      !role ||
      !salary ||
      !jobType ||
      !workLocation ||
      !lastDate
    ) {
      return toast.error("Please fill in all fields.");
    }

    // Check if lastDate is not past or today's date
    const currentDate = new Date();
    const selectedDate = new Date(lastDate);

    if (selectedDate <= currentDate) {
      return toast.error("Please select a future date for Last Date.");
    }

    axios.post("/job-post", formData).then((res) => {
      if (res.data.Status === "Success") {
        // addHrPostJob(formData);
        location.href = "/Hr";
      }
    });
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-lg-8 w-full">
          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-row" style={{ marginLeft: "100px" }}>
              {/* Job Title */}
              <div className="form-group col-md-10">
                <label>Job Title:</label>
                <select
                  name="jobTitle"
                  className="form-control"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Job Title</option>
                  <option value="SDE">SDE</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Mern Stack">Mern Stack</option>
                  <option value="Java full stack developer">
                    Java full stack developer
                  </option>
                </select>
              </div>
              {/* Experience */}
              <div className="form-group col-md-10">
                <label>Experience:</label>
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* City */}
              <div className="form-group col-md-10">
                <label>City:</label>
                <select
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select City</option>
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
              <div className="form-group col-md-10">
                <label>Salary:</label>
                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-10">
                <label>Job Description:</label>
                <textarea
                  name="jobDescription"
                  className="form-control"
                  value={formData.jobDescription}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group col-md-10">
                <label>Minimum Education:</label>
                <select
                  name="minimumEducation"
                  className="form-control"
                  value={formData.minimumEducation}
                  onChange={handleChange}
                >
                  <option value="">Select Education</option>
                  <option value="12th pass">12th pass</option>
                  <option value="Graduation">Graduation</option>
                  <option value="PsotGraduation">PostGraduation</option>
                  <option value="Deploma">Deploma</option>
                </select>
              </div>
              <div className="form-group col-md-10">
                <label>Role:</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-10">
                <label>Job Type:</label>
                <select
                  name="jobType"
                  className="form-control"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="">Select Job Type</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Full Time">Full Time</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="form-group col-md-10">
                <label>Work Location:</label>
                <select
                  name="workLocation"
                  className="form-control"
                  value={formData.workLocation}
                  onChange={handleChange}
                >
                  <option value="">Select Job Location</option>
                  <option value="wfh">Work from home</option>
                  <option value="office">Office work</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group col-md-10">
                <label>Last Date:</label>
                <input
                  type="date"
                  name="lastDate"
                  className="form-control"
                  value={formData.lastDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center mt-4">
                <button type="submit" className="btn btn-primary w-[30%]">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PostJob;
