import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Login from "./Authentication/Login.jsx";
import SignUp from "./Authentication/SignUp.jsx";
import Home from "./Features/pages/Home.jsx";
import ProtectedRoutes from "./Components/ProtectedRoutes.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMeUserThunk } from "./store/slice/user/user.thunk.js";
import Interview from "./Features/pages/Interview.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route element={<ProtectedRoutes />}>
        {" "}
        <Route path="/" element={<Home />} />{" "}
        <Route path="/interview/:interviewId" element={<Interview />} />
      </Route>
    </Route>,
  ),
);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMeUserThunk());
  }, [dispatch]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
