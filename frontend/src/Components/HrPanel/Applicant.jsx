import React from "react";

function Applicant({ applicant }) {
  console.log(applicant);
  return (
    <>
      <tr>
        <th scope="row">1</th>
        <td>{applicant.JsFName + " " + applicant.JsLName}</td>
        <td>{applicant.JsEmail}</td>
        <td>{applicant.Phone}</td>
        <td>
          {/* Render the resume link as a button */}
          <a href={applicant.Resume} target="_blank" rel="noopener noreferrer">
            <button>View Resume</button>
          </a>
        </td>
        <td>
          {/* Link to Gmail compose page */}
          <a
            href={`mailto:${applicant.JsEmail}`} // Corrected template literal syntax
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Contact via Gmail</button>
          </a>
        </td>
      </tr>
    </>
  );
}

export default Applicant;
