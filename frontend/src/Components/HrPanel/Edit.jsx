import React, { useRef, useState } from "react";
import "./EditHrprofile.css";

export default function Edit({
  type,
  values,
  editDetails,
  handleEdit,
  isEdit,
}) {
  const value = useRef();

  const saveData = () => {
    editDetails(type, value.current.value);
    // console.log(value.current.value);
    handleEdit("");
  };

  const handleFocus = () => {
    handleEdit(type);
  };

  return (
    <tr className={`edit p-1 ${isEdit === type ? "input-focused" : ""}`}>
      <td className="w-[20%]">
        <label>{type} : </label>
      </td>
      <td className="w-[50%]">
        <input
          type="text"
          className={` h-8 mt-2 me-4 w-[100%] ps-1${
            isEdit === type ? " border border-primary rounded-xl" : ""
          }`}
          name={type}
          defaultValue={values}
          ref={value}
          disabled={isEdit !== type}
          onFocus={handleFocus}
        />
      </td>
      <td className="w-[25%]">
        {isEdit !== type && (
          <button className="ms-5" onClick={() => handleEdit(type)}>
            Edit
          </button>
        )}
        {isEdit === type && (
          <>
            <button
              className="btn btn-primary mt-2 me-2 h-8"
              onClick={saveData}
            >
              Save
            </button>
            <button
              className="btn btn-danger mt-2 h-8"
              onClick={() => handleEdit("")}
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
