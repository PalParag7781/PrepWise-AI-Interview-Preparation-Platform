import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../store/slice/user/user.thunk";
import logo from "../assets/logo.png";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const { buttonLoading, isAuthenticated } = useSelector((state) => state.user);

  const changeEventHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUserThunk(input)).unwrap();
    } catch (error) {
      console.log("LOGIN ERROR:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen  bg-[#0F0F1A] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="text-amber-100 flex items-center justify-center p-3 mb-4 text-xl ">
        <h1 className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 tracking-wide  bg-clip-text text-transparent text-4xl ">
          PrepWise
        </h1>
      </div>

      <div className="w-full max-w-sm space-y-6">
        <form
          onSubmit={loginHandler}
          className="border border-gray-700 bg-[#141423] rounded-2xl p-6 shadow-lg flex flex-col gap-4"
        >
          <h1 className="text-white font-bold text-2xl mb-2">Sign In</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-white font-bold text-sm ">
              {" "}
              Enter email address{" "}
            </label>
            <input
              id="email"
              placeholder="email"
              type="email"
              name="email"
              required
              className="bg-[#1A1A2E] border rounded-md border-[#2A2A3F] placeholder:text-[#9CA3AF] focus:border-[#6B6B85] placeholder:p-1 text-white"
              onChange={changeEventHandler}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-white font-bold text-sm">
              {" "}
              Enter the password
            </label>
            <input
              id="password"
              placeholder="password"
              type="password"
              name="password"
              required
              minLength={7}
              className="bg-[#1A1A2E] border rounded-md border-[#2A2A3F] placeholder:text-[#9CA3AF] focus:border-[#6B6B85] placeholder:p-1 text-white"
              onChange={changeEventHandler}
            />
          </div>
          {buttonLoading ? (
            <button
              type="submit"
              className="text-white bg-indigo-600 rounded-2xl w-full border border-gray-600 bg-[#1A1A2E] hover:bg-[#252542] font-medium transition-colors transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-primary/40 "
              disabled={buttonLoading}
            >
              <span className="loading loading-spinner loading-md"></span>
              loading
            </button>
          ) : (
            <button
              type="submit"
              className="text-white bg-indigo-600 rounded-2xl w-full border border-gray-600 bg-[#1A1A2E] hover:bg-[#252542] font-medium transition-colors transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Login
            </button>
          )}
        </form>

        <div className="flex flex-col gap-2">
          <div className=" flex py-2 items-center w-full">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-xs font-medium">
              New to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 tracking-wide  bg-clip-text text-transparent  ">
                PrepWise?
              </span>
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <Link
            className="text-white bg-indigo-600 rounded-2xl w-full border border-gray-600 bg-[#1A1A2E] hover:bg-[#252542] font-medium transition-colors flex items-center justify-center 
             cursor-pointer"
            to={"/signUp"}
          >
            {" "}
            Register{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
