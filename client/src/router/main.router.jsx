import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/Layout/Layout";
import SignIn from "@/pages/sing-in/sing-in";
import Home from "@/pages/home/home";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<Error />} />
          <Route path="/" element={<Home />} />
          <Route path="/sing-in" element={<SignIn />} />
          {/* <Route path="/registration" element={<Registration />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
