import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    compName: "",
    address: "",
    hrname: "",
    aadhar: "",
    email: "",
    contact: "",
    logo: "",
    web: "",
    password: "",
  });
  const [logo, setLogo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    // for (const key in formData) {
    //   if (!formData[key]) {
    //     return toast.error(`Please fill in ${key}`);
    //   }
    // }

    const data = new FormData();
    data.append("name", formData.hrname);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("adhar", formData.aadhar);
    data.append("CompName", formData.compName);
    data.append("CompAdd", formData.address);
    data.append("CompPhone", formData.contact);
    data.append("web", formData.web);
    data.append("logo", logo);

    axios
      .post("/postdata-hr", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.Status === "Success") navigate("/companylogin");
        else alert(res.data.Error);
      })
      .catch((error) => {
        console.error("Error while submitting form:", error);
        toast.error(
          "An error occurred while submitting the form. Please try again."
        );
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  return (
    <div className="container justify-content-center align-items-center">
      <ToastContainer />
      <div className="card p-4" style={{ width: "575px", background: "#333" }}>
        <center>
          <h3 className="text-white mb-4">Registration Form</h3>
        </center>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          {/* Company Name */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="compName"
                name="compName"
                placeholder="Company Name"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Company Address */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Company Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                placeholder="Street Address"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Name */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Name</label>
              <input
                type="text"
                className="form-control"
                id="hrname"
                name="hrname"
                placeholder="Name"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Aadhar Number */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Aadhar Number</label>
              <input
                type="number"
                className="form-control"
                id="aadhar"
                name="aadhar"
                placeholder="Aadhar number"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Email */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Email</label>
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
          {/* Contact Number */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Contact Number</label>
              <input
                type="number"
                className="form-control"
                id="contact"
                name="contact"
                placeholder="Contact Number"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Company website */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Company website</label>
              <input
                type="text"
                className="form-control"
                id="web"
                name="web"
                placeholder="Enter Company website"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Upload Company Logo */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">
                Upload Company Logo
              </label>
              <input
                type="file"
                className="form-control"
                id="logo"
                name="logo"
                placeholder="Upload Company logo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {/* Password */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Submit Button */}
          <button type="submit" className="btn btn-dark w-100 mb-2 bg-primary">
            REGISTER
          </button>
        </form>
        {/* Login Link */}
        <p className="mt-2 text-white">
          Already have an account?
          <Link to="/companylogin" className="text-decoration-none text-white">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyRegister;
