// Feedback.jsx
import React from "react";
import style from "./Feedback.module.css";

function Feedback({ data }) {
  //   console.log(data);
  return (
    <div className={style.card}>
      <h1 className="fs-4 fw-bold pb-2">{data.FSubject}</h1>
      <hr />
      <p className="pt-2">{data.Fdescription}</p>
    </div>
  );
}

export default Feedback;
