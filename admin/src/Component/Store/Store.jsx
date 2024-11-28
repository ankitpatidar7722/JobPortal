import { createContext, useState } from "react";

export const AllData = createContext({
  handleAuth: () => {},
  handleSelectedTab: () => {},
  handleReq: () => {},
  handleHrId: () => {},
});
const DataProvider = ({ children }) => {
  const [adminAuth, setAdminAuth] = useState(false);
  const handleAuth = (temp) => {
    setAdminAuth(temp);
  };
  const [handleHr, setHr] = useState(-1);
  const handleHrId = (id) => {
    setHr(id);
  };
  const [selectedTab, setSelectedTab] = useState("allRequest");
  const handleSelectedTab = (temp) => {
    setSelectedTab(temp);
  };
  const [allReq, setAllReq] = useState(null);
  const handleReq = async (data) => {
    await setAllReq(data);
  };
  return (
    <AllData.Provider
      value={{
        adminAuth,
        handleAuth,
        handleSelectedTab,
        selectedTab,
        handleReq,
        allReq,
        handleHrId,
        handleHr,
      }}
    >
      {children}
    </AllData.Provider>
  );
};
export default DataProvider;
