import React, { useContext } from "react";
import "./viewProfile.css";
import { AllData } from "../Store/Store";
import axios from "axios";

function ViewProfile() {
  axios.defaults.withCredentials = true;
  const { handleSelectedTab, handleHr, allReq, handleReq } =
    useContext(AllData);
  const id = allReq[handleHr].HrID;

  const handleVerify = () => {
    axios.post("/handle-varify", { id }).then((res) => {
      if (res.data.Status === "Success") {
        location.reload(true);
      }
    });
  };

  const handleDelete = () => {
    // Add functionality for deletion
    console.log(id);
    axios.post("/delete-hr", { id }).then((res) => {
      if (res.data.Status === "Success") {
        location.reload(true);
      }
    });
  };

  if (allReq === null || handleHr === -1) {
    return <center>Loading</center>;
  } else if (handleHr >= allReq.length) {
    return <center>Something happened wrong</center>; // corrected typo
  }

  const handleWebsiteClick = (url) => {
    // Check if the URL starts with a protocol, if not, prepend "http://"
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    window.open(url, "_blank");
  };
  return (
    <div className="profile-com">
      <div className="flex justify-content-between font-bold text-xl">
        <button
          style={{
            background: "rgb(31, 130, 104)",
            width: "180px",
            height: "30px",
            borderRadius: "10px",
          }}
          onClick={() => {
            handleSelectedTab("allRequest");
          }}
        >
          BACK
        </button>
        <div>
          <button
            style={{
              background: "rgb(31, 130, 104)",
              width: "160px",
              height: "30px",
              borderRadius: "10px",
              marginRight: "10px",
            }}
            onClick={handleVerify}
          >
            Verify
          </button>
          <button
            style={{
              background: "#e73434",
              width: "160px",
              height: "30px",
              borderRadius: "10px",
              marginLeft: "10px",
            }}
            onClick={handleDelete}
          >
            DELETE
          </button>
        </div>
      </div>
      <div className="row p-3 table-container">
        <table className="interactive-table">
          <tbody>
            <tr>
              <td className="w-[30%]">Company Name</td>
              <td className="w-[50%]">{allReq[handleHr].CompName}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Hr Name</td>
              <td className="w-[50%]">{allReq[handleHr].HrName}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Hr Adhar</td>
              <td className="w-[50%]">{allReq[handleHr].AdharId}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Company Address</td>
              <td className="w-[50%]">{allReq[handleHr].CompADD}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Company contact</td>
              <td className="w-[50%]">{allReq[handleHr].CompPhone}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Company Email</td>
              <td className="w-[50%]">{allReq[handleHr].HrEmail}</td>
            </tr>
            <tr>
              <td className="w-[30%]">Company Website</td>
              <td
                className="w-[50%]"
                onClick={() => handleWebsiteClick(allReq[handleHr].CompWeb)}
              >
                {allReq[handleHr].CompWeb}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewProfile;
