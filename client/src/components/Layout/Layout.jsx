import { Outlet } from "react-router";
import { Header } from "../Header/Header";
import { testUser } from "../../test/test.user";

export const Layout = () => {

  return (
    <div className="min-h-screen bg-[url('/BG.jpg')] bg-cover bg-center bg-fixed">
      <Header user={testUser} />

      <main>
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
};
