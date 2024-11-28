import React, { useContext, useEffect } from "react";
import Request from "./Request";
import "./allrequest.css";
import axios from "axios";
import { AllData } from "../Store/Store";

function AllRequest() {
  axios.defaults.withCredentials = true;
  const { allReq, handleReq } = useContext(AllData);

  useEffect(() => {
    if (allReq === null) {
      // console.log("hello");
      axios.get("/allRequest").then((res) => {
        if (res.data.Status === "Success") {
          handleReq(res.data.request);
        }
      });
    }
  }, [allReq, handleReq]); // Include allReq and handleReq in dependency array

  if (allReq === null) {
    return <center>Loading</center>;
  }

  return (
    <div className="allRequest">
      {allReq.length === 0 && (
        <center>
          <h1>No request avaliable</h1>
        </center>
      )}
      {allReq.map((data, idx) => (
        <Request key={data.HrID} idx={idx} data={data} />
      ))}
    </div>
  );
}

export default AllRequest;
