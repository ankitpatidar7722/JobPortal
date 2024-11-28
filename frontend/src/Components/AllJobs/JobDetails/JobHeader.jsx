// CompanyHeader.jsx

import React from "react";
import styles from "./JobHeader.module.css";
import { toast } from "react-toastify";
import axios from "axios";
const JobHeader = ({ jobId, job }) => {
  function handleApply() {
    console.log(jobId);
    axios.post("/applyJob", { jobId }).then((res) => {
      if (res.data.Status === "Success") {
        toast.success("Applied", {
          autoClose: 1000,
          onClose: () => {
            window.location.href = "/AllJobs";
          },
        });
      } else if (res.data.Status === "Failed") {
        toast.warning(res.data.Message);
      }
    });
  }
  return (
    <header className={styles.h11}>
      <div className={styles.HH}>
        <div className={styles.overlay}>
          <h1 className="text-[50px] font-bold">{job.CompName}</h1>
        </div>

        <div className={styles.btn1}>
          <button className={styles.but} onClick={handleApply}>
            Apply Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default JobHeader;
