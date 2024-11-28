import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import MainJobs from "./Components/AllJobs/MainJobs.jsx";
import JobProfile from "./Components/AllJobs/JobDetails/JobProfile.jsx";
import CompanyLogin from "./Components/LoginRegister/CompanyLogin.jsx";
import CompanyRegister from "./Components/LoginRegister/CompanyRegister.jsx";
import Login from "./Components/LoginRegister/Login.jsx";
import Register from "./Components/LoginRegister/Register.jsx";
import Hr from "./Components/HrPanel/Hr.jsx";
import Home from "./Components/HomePage/Home.jsx";
import Profile from "./Components/UserPanel/Profile.jsx";
import AddEducation from "./Components/LoginRegister/AddEducation.jsx";
import AddExperience from "./Components/LoginRegister/AddExperience.jsx";
const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/AllJobs" element={<MainJobs />} />
      <Route path="/AllJobs/apply/:JobId" element={<JobProfile></JobProfile>} />
      <Route path="/login" element={<Login />} />
      <Route path="/experience" element={<AddExperience />} />
      <Route path="/education" element={<AddEducation />} />
      <Route path="/register" element={<Register />} />
      <Route path="/companylogin" element={<CompanyLogin />} />
      <Route path="/companyregister" element={<CompanyRegister />} />
      <Route path="/Hr" element={<Hr />} />
      <Route path="/user" element={<Profile></Profile>}></Route>
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
