import React, { useEffect, useState } from "react";
import axios from "axios";

function AllCompany() {
  axios.defaults.withCredentials = true;
  const [allcomp, setAllCom] = useState(null);

  useEffect(() => {
    if (allcomp === null) {
      axios
        .get("/allCompany")
        .then((res) => {
          // Update state with fetched data
          setAllCom(res.data.AllCompany);
        })
        .catch((error) => {
          // Handle errors if any
          console.error("Error fetching data:", error);
        });
    }
  }, [allcomp]); // Add allcomp to dependency array

  if (allcomp === null)
    return (
      <center>
        <h1>Loading</h1>
      </center>
    );

  return (
    <table
      className="table ms-3 me-3 mt-3"
      style={{
        borderRadius: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Contact</th>
          <th scope="col">Email</th>
          <th scope="col">Web</th>
          {/* <th>View profile</th> */}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(allcomp) &&
          allcomp.map((company, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{company.CompName}</td>
              <td>{company.CompPhone}</td>
              <td>{company.HrEmail}</td>
              <td>{company.CompWeb}</td>
              {/* <td>
                <button className="btn btn-primary">Profile </button>
              </td> */}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default AllCompany;
