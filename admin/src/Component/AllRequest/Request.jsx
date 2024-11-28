import { useContext } from "react";
import "./request.css";
import { AllData } from "../Store/Store";

export default function Request({ data, idx }) {
  const { handleSelectedTab, handleHrId } = useContext(AllData);
  return (
    <div className="main mt-4">
      <div className="w-[12%]">
        <h1 className="p-1 text-xm font-bold">Hr Name</h1>
        <h2 className="p-1">{data.HrName}</h2>
      </div>
      <div className="vertical-line"></div>
      <div className="w-[15%]">
        <h1 className="p-1 text-xm font-bold">Company</h1>
        <h1 className="p-1">{data.CompName}</h1>
      </div>
      <div className="vertical-line"></div>
      <div className="w-[12%]">
        <h1 className="p-1 text-xm font-bold">Company Address</h1>
        <h1 className="p-1">{data.CompADD}</h1>
      </div>
      <div className="vertical-line"></div>
      <div className="w-[10%]">
        <button
          className="btn btn-secondary btn-lg mt-2 h-[65%] w-[90%] pt-2"
          onClick={() => {
            handleHrId(idx);
            handleSelectedTab("viewProfile");
          }}
        >
          View
        </button>
      </div>
    </div>
  );
}
