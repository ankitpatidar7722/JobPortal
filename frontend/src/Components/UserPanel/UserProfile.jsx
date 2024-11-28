import React, { useContext, useEffect, useState } from "react";
import { AllFunction } from "../store/store";
import style from "./Userprofile.module.css";
import EditP from "./EditP";
import axios from "axios";
function UserProfile() {
  const { userData, handleUserdata, handleAuth } = useContext(AllFunction);
  axios.defaults.withCredentials = true;
  const [Name, setName] = useState(userData.JsFName);
  const [Email, setEmail] = useState(userData.JsEmail);
  const [Phone, setPhone] = useState(userData.Phone);
  const [ExpYear, setExpYear] = useState(userData.JsExpYear);
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      axios.get("/").then((res) => {
        if (res.data.Status === "Success") {
          if (res.data.type === "user") handleAuth("user", true);
          else if (res.data.type === "hr") {
            handleAuth("hr", true);
            window.location.href = "/hr";
          }
        }
      });
    }
  }, []);
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token") && !image) {
      axios
        .get("/get-user-image")
        .then((res) => {
          if (res.data.imageUrl) {
            setImage(res.data.imageUrl);
          }
        })
        .catch((error) => {
          console.error("Error fetching user image:", error);
        });
    }
  }, [image]);
  useEffect(() => {
    if (localStorage.getItem("token") != null && userData.JsName === "") {
      axios.get("/get-userdata").then((res) => {
        if (res.data.Status === "Success") {
          handleUserdata(res.data.info);
          setName(res.data.info.JsFName);
          setEmail(res.data.info.JsEmail);
          setPhone(res.data.info.Phone);
          setExpYear(res.data.info.JsExpYear);
        }
      });
    }
  }, []);

  const editDetails = (type, value) => {
    if (type === "Name") setName(value);
    else if (type === "Email") setEmail(value);
    else if (type === "Phone") setPhone(value);
    else if (type === "ExpYear") setExpYear(value);
  };
  const updateProfile = () => {
    console.log("hello");
    axios
      .post("/update-user-data", { Name, Email, Phone, ExpYear })
      .then((res) => {
        if (res.data.Status === "Success") {
          location.reload(true);
        }
      });
  };
  const [isEdit, setEdit] = useState("");
  const handleEdit = (type) => {
    setEdit(type);
  };
  return (
    <div className="flex flex-col lg:flex-row">
      <div className={`shadow-sm ${style.first}`}>
        <img src={image} className={style.img}></img>
      </div>

      <br />
      <div className="pt-5 pl-0 w-[50%] ">
        <div className={style.firstt}>
          <EditP
            type="Name"
            values={Name}
            editDetails={editDetails}
            handleEdit={handleEdit}
            isEdit={isEdit}
          />
        </div>

        <br />
        <div className={style.firstt}>
          <EditP
            type="Email"
            values={Email}
            editDetails={editDetails}
            handleEdit={handleEdit}
            isEdit={isEdit}
          />
        </div>
        <br />
        <div className={style.firstt}>
          <EditP
            type="Phone"
            values={Phone}
            editDetails={editDetails}
            handleEdit={handleEdit}
            isEdit={isEdit}
          />
        </div>
        <br />
        <div className={style.firstt}>
          <EditP
            type="ExpYear"
            values={ExpYear}
            editDetails={editDetails}
            handleEdit={handleEdit}
            isEdit={isEdit}
          />
        </div>
        <center>
          <br />
          <button
            type="button"
            className="btn btn-success"
            style={{
              margin: "auto",
              height: "50px",
              width: "150px",
              fontWeight: "bold",
              fontSize: "large",
              color: "green",
            }}
            onClick={updateProfile}
          >
            Update
          </button>
        </center>
        <br />
      </div>
    </div>
  );
}

export default UserProfile;
