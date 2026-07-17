import Siderbar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] overflow-hidden">
      <Siderbar />

      <div className="bg-white w-full h-full max-md:rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
