import React from "react";
import styles from "./JobDetail.module.css";

const JobDetail = ({ job }) => {
  return (
    <div className={styles.container}>
      <div>
        <h1 className="text-6xl font-bold">{job.CompName}</h1>
        <hr />

        <div className={styles.jobDetails}>
          <h2 className="text-4xl font-bold">Job Details</h2>
          <hr />
          <div className={styles.jobD}>
            <div className="p-2">
              <p>
                <strong>Education:</strong> {job.MiniEducat}
              </p>
              <p>
                <strong>Experience:</strong> {job.JobExperience}
              </p>
              <p>
                <strong>Type</strong>{" "}
                {job.workLocation === "wfh"
                  ? " Work from home"
                  : job.workLocation}
              </p>
              <p>
                <strong>Location</strong> {job.City}
              </p>
            </div>

            <div className="p-2">
              <p>
                <strong>English Level:</strong> average English
              </p>
              <p>
                <strong>Gender:</strong> Both
              </p>
              <p>
                <strong>Salary:</strong> {job.Salary}
              </p>
              <p>
                <strong>Type:</strong> Intership
              </p>
            </div>
          </div>
        </div>
        <div className={styles.Line}></div>
        <div className={styles.jobDescription}>
          <h2 className="text-4xl font-bold">Job Description</h2>
          <hr />
          <p>{job.JobDescr}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
