import { Outlet } from "react-router-dom";

const MainLayout = () => {

  return (
    <div className="relative overflow-hidden">
      <div className="z-10">
        <Outlet />
      </div>
      <div className=" w-full">
      {/* <Footer/> */}

      </div>

    </div>
  );
};

export default MainLayout;
