import React from "react";

function Application({ application, idx }) {
  return (
    <tr>
      <th scope="row">{idx + 1}</th>
      <td>{application.JobTitle}</td>
      <td>{application.CompName}</td>
      <td>{application.CompWeb}</td>
      <td>{application.JaStatus}</td>
      <td>
        <button style={{ paddingLeft: "20px" }}>View</button>
      </td>
    </tr>
  );
}

export default Application;
