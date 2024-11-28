import React, { useContext, useEffect, useState } from "react";
import JobHeader from "./JobHeader";
import JobDetail from "./JobDetail";
import { useParams } from "react-router-dom";
import { AllFunction } from "../../store/store";
import axios from "axios";

axios.defaults.withCredentials = true;

const JobProfile = () => {
  const jobId = useParams();
  const jobIdInt = parseInt(jobId.JobId.replace(/[^0-9]/g, ""), 10);
  const { allJobs, handleAllJobs, handleAuth } = useContext(AllFunction);

  useEffect(() => {
    if (allJobs === null) {
      axios.get("/allJobs").then((res) => {
        if (res.data.Status === "Success") {
          handleAllJobs(res.data.jobs);
        }
      });
    }
  }, [allJobs]);

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

  const [data, setData] = useState(null);
  useEffect(() => {
    if (allJobs != null) {
      const data1 = allJobs.filter((job) => jobIdInt === job.JobId);
      setData(data1[0]); // Moved setData outside the filter function
    }
  }, [allJobs, jobIdInt]); // Added allJobs and jobIdInt to the dependency array

  return (
    <div>
      {data !== null && <JobHeader jobId={jobIdInt} job={data}></JobHeader>}
      {data !== null && <JobDetail job={data}></JobDetail>}{" "}
    </div>
  );
};

export default JobProfile;
