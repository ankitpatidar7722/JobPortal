// AllFeedback.jsx
import React, { useEffect, useState } from "react";
import Feedback from "./Feedback";
import axios from "axios";
import style from "./Feedback.module.css";
function AllFeedback() {
  const [feedback, setFeedback] = useState(null);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (feedback === null) {
      axios.get("/feedback").then((res) => {
        if (res.data.Status === "Success") {
          // console.log(res.data.feedback);
          const temp = res.data.feedback;
          temp.reverse();
          setFeedback(temp);
        }
      });
    }
  }, []);

  if (feedback === null) return <center>Loading</center>;

  return (
    <div className={style.allCard}>
      {feedback.map((data, idx) => (
        <Feedback key={data.FId} data={data}></Feedback>
      ))}
    </div>
  );
}

export default AllFeedback;
