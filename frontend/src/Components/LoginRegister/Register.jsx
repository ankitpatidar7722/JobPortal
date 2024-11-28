import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AllFunction } from "../store/store";

const Register = () => {
  const navigate = useNavigate();
  const { handleAuth } = useContext(AllFunction);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    adhar: "",
    url: "",
    experience: "",
    profilePhoto: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    for (const key in formData) {
      if (!formData[key]) {
        return alert(
          `Please fill in ${key === "firstName" ? "First Name" : key}`
        );
      }
    }

    // Check minimum age (18 years)
    const currentDate = new Date();
    const dobDate = new Date(formData.dob);
    const ageDiff = currentDate.getFullYear() - dobDate.getFullYear();
    if (ageDiff < 18) {
      return alert("You must be at least 18 years old to register.");
    }

    // Check if experience is not negative
    if (formData.experience < 0) {
      return alert("Experience cannot be negative.");
    }

    // Check Aadhar number length (12 digits)
    if (formData.adhar.length !== 12) {
      return alert("Aadhar number must be exactly 12 digits.");
    }

    // Check contact number length (10 digits)
    if (formData.phone.length !== 10) {
      return alert("Contact number must be exactly 10 digits.");
    }

    // Check password length (at least 6 characters)
    if (formData.password.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }

    try {
      const formdata = new FormData();
      for (const key in formData) {
        formdata.append(key, formData[key]);
      }
      const res = await axios.post("/postdata-user", formdata);

      if (res.data.Status === "Success") {
        const data = {
          JsFName: formData.firstName,
          JsLName: formData.lastName,
          JsEmail: formData.email,
          DOB: formData.dob,
          Phone: formData.phone,
          JsExpYear: formData.experience,
          Resume: formData.url,
          ProfilePhoto: formData.profilePhoto.name,
        };
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("info", JSON.stringify(data));
        handleAuth("user", true);
        navigate("/education");
      } else {
        throw new Error(res.data.Error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error while submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePhotoChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: e.target.files[0],
    }));
  };

  const handleUrlChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      url: e.target.value,
    }));
  };

  return (
    <div className="container justify-content-center align-items-center">
      <div className="card p-4" style={{ width: "575px", background: "#333" }}>
        <center>
          <h3 className="text-white mb-4">Registration Form</h3>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="firstName" className="form-label text-white">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="lastName" className="form-label text-white">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="phone" className="form-label text-white">
                Contact Number
              </label>
              <input
                type="number"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Contact Number"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="email" className="form-label text-white">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="dob" className="form-label text-white">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                name="dob"
                placeholder="Date of Birth"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="gender" className="form-label text-white">
                Gender
              </label>
              <select
                className="form-control"
                id="gender"
                name="gender"
                required
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="adhar" className="form-label text-white">
                Aadhar Number
              </label>
              <input
                type="number"
                className="form-control"
                id="adhar"
                name="adhar"
                placeholder="Aadhar Number"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="experience" className="form-label text-white">
                Experience
              </label>
              <input
                type="number"
                className="form-control"
                id="experience"
                name="experience"
                placeholder="Years of Experience"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="url" className="form-label text-white">
                Resume URL
              </label>
              <input
                type="text"
                className="form-control"
                id="url"
                name="url"
                placeholder="Resume URL"
                required
                onChange={handleUrlChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="profilePhoto" className="form-label text-white">
                Profile Photo
              </label>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                className="form-control"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="password" className="form-label text-white">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                required
                minLength="6"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 mb-2 bg-primary">
            REGISTER
          </button>
        </form>

        <p className="mt-2 text-white">
          Already have an account?
          <Link to="/login" className="text-decoration-none text-white">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
