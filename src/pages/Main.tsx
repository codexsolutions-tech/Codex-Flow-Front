import Siderbar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Siderbar />
      <main className="min-w-0 flex-1 overflow-hidden bg-[#0e0d1a] max-md:rounded-lg shadow-lg">
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
