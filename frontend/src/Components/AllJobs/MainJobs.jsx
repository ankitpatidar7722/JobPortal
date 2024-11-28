import { useContext, useEffect, useState } from "react";
import Cards from "./cards/Cards";
import Filter from "./Filter";
import style from "./MainJobs.module.css";
import { AllFunction } from "../store/store";
import axios from "axios";
export default function MainJobs() {
  axios.defaults.withCredentials = true;
  const { handleAuth, allJobs, handleAllJobs, search } =
    useContext(AllFunction);
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
  });
  const array = [
    {
      companyName: "Bajaj Allianz General Insurance Company Limited",
      jobRole: "Software Engineer",
      jobType: "Work from Home",
      jobTime: "Full time",
      textRequire: "No test required",
      minSalary: 60000,
      maxSalary: 100000,
    },
  ];
  const [job, setJob] = useState(array);
  function applyFilter(newArray) {
    setJob(newArray);
  }
  useEffect(() => {
    console.log(search);
    if (allJobs === null && search === null) {
      axios.get("/allJobs").then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data.jobs);
          const jobs = res.data.jobs;
          jobs.reverse();
          handleAllJobs(jobs);
        }
      });
    }
  }, []);
  return (
    <div className={style.mainjobs}>
      <Filter jobs={array} applyFilter={applyFilter} />
      <Cards jobs={allJobs} />
    </div>
  );
}
