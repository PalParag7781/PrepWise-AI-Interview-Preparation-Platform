import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  generateInterviewReportThunk,
  getAllInterviewReportsThunk,
} from "../../store/slice/interview/interview.thunk.js";
import { logoutUserThunk } from "../../store/slice/user/user.thunk.js";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, userProfile, screenLoading } = useSelector(
    (state) => state.user,
  );
  const { buttonLoading, loading, reports } = useSelector(
    (state) => state.interview,
  );

  const [jobDescription, setjobDescription] = useState("");
  const [selfDescription, setselfDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const resumeRef = useRef(null);

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setResumeName(selectedFile.name);
    }
    if (!selectedFile) {
      return;
    }
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("File size must be less than 5MB");
      e.target.value = "";
      return;
    }
    setResumeName(selectedFile.name);
  };

  const handleGenerateReport = async () => {
    if (!jobDescription) {
      alert("Please enter the job description");
      return;
    }
    const resume = resumeRef.current.files[0];

    if (!resume && !selfDescription) {
      alert("Please upload your resume or  enter your self description");
      return;
    }

    try {
      const response = await dispatch(
        generateInterviewReportThunk({
          resume,
          selfDescription,
          jobDescription,
        }),
      ).unwrap();
      navigate(`/interview/${response.interviewReport._id}`);
    } catch (error) {
      console.log("GENERATE ERROR:", error);
    }
  };

  const logoutHandler = async (e) => {
    try {
      e.preventDefault();
      await dispatch(logoutUserThunk()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllInterviewReportsThunk());
  }, [dispatch, isAuthenticated]);
  // screenLoading
  if (screenLoading) {
    return (
      <main className="min-h-screen bg-[#0f1217] flex items-center justify-center">
        <h1 className="text-white">Loading...</h1>
      </main>
    );
  }

  // Authentication

  if (!isAuthenticated) {
    navigate("/login", { replace: true });
  }

  return (
    <div className="bg-[#0f1217] min-h-screen w-full px-4 py-8 flex flex-col ">
      {/* Header */}
      <div className="w-full mb-3 sm:mb-4  ">
        <header className="flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-sm sm:text-base md:text-lg cursor-pointer"
          >
            {" "}
            ✦ PrepWise
          </h1>

          {/* Dropdown  */}
          <div className="dropdown dropdown-bottom">
            {userProfile && (
              <div
                tabIndex={0}
                role="button"
                className=" group border border-pink-600 text-pink-500 rounded-xl  bg-[#ff2d78]/15 uppercase tracking-wide text-xs flex items-center justify-between w-35 px-3 py-2 sm:px-3 cursor-pointer"
              >
                <span className="text-white font-bold">
                  👤 {userProfile.userName}
                </span>

                <span className="text-white font-extrabold relative -top-[1px] shrink-0 transition-transform group-focus:rotate-180 duration-500 ">
                  ⌄
                </span>
              </div>
            )}

            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <button
                  onClick={logoutHandler}
                  className="text-red-400 
                active:scale-[0.96]hover:text-red-300  transition-all duration-200 ease-out 
                cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3H9m0 0 3-3m-3 3 3 3"
                    />
                  </svg>
                  <span>logout</span>
                </button>
              </li>
            </ul>
          </div>
        </header>
      </div>
      {/* Main Card */}
      <div className="border-gray-500 border-2 rounded-2xl shadow-black shadow-2xl  bg-[#162030] overflow-hidden">
        {/* Top Section */}

        <div className="flex flex-col lg:flex-row gap-3 ">
          {/* Left Panel */}
          <div className="flex-1 p-3 flex flex-col p-5 sm:p-6 ">
            <div className="flex gap-3 items-center">
              <span>💼</span>
              <h2 className="font-bold text-white">Target Job Description</h2>
              <span className="border border-pink-600 text-pink-500 rounded-xl px-2 py-0.5 bg-[#ff2d78]/15 uppercase tracking-wide ml-auto text-xs">
                Required
              </span>
            </div>
            <div className="relative mt-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setjobDescription(e.target.value)}
                maxLength={5000}
                placeholder="Enter the job description"
                className="h-full min-h-[300px] w-full border border-[#2a3348] bg-[#1e2535] rounded-lg p-3 text-[#e6edf3] placeholder:text-[#7d8590] transition focus:border-[#ff2d78] resize-none leading-6 hover:border-[#ff2d78]"
              />
              <span className="absolute bottom-3 right-3 text-xs text-[#7d8590]">
                {jobDescription.length} / 5000 chars
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-px
        bg-gray-500 lg:block hidden  "
          />
          <div className="h-px bg-gray-500 lg:hidden " />
          {/* Right Panel */}
          <div className="flex-1 p-3 flex flex-col p-5 sm:p-6">
            <div className="flex gap-2 items-center">
              <span>👤</span>
              <h1 className="text-white font-bold ">Your Profile</h1>
            </div>

            {/* Upoad Resume */}
            <div className="mt-3">
              <label className="text-sm font-medium text-white tracking-wide flex items-center gap-4">
                Upload Resume
                <span className="border border-pink-600 text-pink-500 rounded-xl text-xs px-2 py-0.5 bg-[#ff2d78]/15 uppercase tracking-wide">
                  Best Results
                </span>
              </label>

              <label
                htmlFor="resume"
                className="flex flex-col items-center justify-center gap-2 bg-[#1e2535] border-2 border-dashed border-[#2a3348] rounded-lg mt-3 items-center justify-center cursor-pointer hover:border-[#ff2d78] transition hover:bg-[#ff2d78]/5 px-4 py-8   "
              >
                <span className="text-3xl text-[#ff2d78]">↑</span>

                <p className="text-sm font-medium">
                  {resumeName ? resumeName : "Click to upload or drag & drop"}
                </p>

                <p className="text-xs text-[#7d8590]">PDF or DOCX (Max 5MB)</p>
                <input
                  id="resume"
                  ref={resumeRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeChange}
                  hidden
                />
              </label>
            </div>
            {/* Divider */}
            <div className="flex items-center gap-3 text-white text-xs mt-2">
              <div className="h-px bg-gray-500 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-gray-500 flex-1"></div>
            </div>

            {/* self Description */}
            <div className="flex flex-col gap-3">
              <span className="font-medium text-white tracking-wide ">
                Quick Self Description
              </span>
              <textarea
                value={selfDescription}
                onChange={(e) => setselfDescription(e.target.value)}
                placeholder="Enter self description... "
                className="h-24 w-full border border-[#2a3348] bg-[#1e2535] rounded-lg p-3 text-[#e6edf3] placeholder:text-[#7d8590] transition 
              hover:border-[#ff2d78] focus:border-[#ff2d78] resize-none leading-6   "
              />
            </div>

            {/* info */}
            <div className="flex items-center justify-center border border-[#2d4a7a] bg-[#1b2a4a] rounded-lg mt-4 gap-2 items-start px-2 py-4 ">
              <span className="text-[#8ab4f8]">ⓘ</span>
              <p className="text-xs leading-5 text-[#8ab4f8]">
                Either a <strong className="text-[#e6edf3]">Resume</strong> or a{" "}
                <strong className="text-[#e6edf3]">Self Description</strong> is
                required to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* divider */}

        <div className="h-px bg-gray-500 " />
        {/* Bottom section */}
        <div className="flex gap-3 px-5 py-4 items-center justify-between">
          <span className="sm:text-xs text-[#7d8590] text-[8px]">
            AI-Powered Strategy Generation • Approx 30s
          </span>

          <button
            disabled={buttonLoading}
            onClick={handleGenerateReport}
            className=" w-auto gap-2 rounded-lg bg-[#ff2d78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e62569] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 text-[10px]sm:text-xs cursor-pointer"
          >
            {buttonLoading ? (
              <div className="flex items-center gap-1">
                <span className="loading loading-spinner loading-md"></span>
                <span>Generating...</span>
              </div>
            ) : (
              "  ✦ Generate My Interview Strategy"
            )}
          </button>
        </div>
      </div>
      {/* Recent Reports List  */}

      {reports.length > 0 && (
        <section className="flex w-full max-w-[900px] flex-col gap-3">
          <h2 className="text-xl font-semibold text-[#e6edf3] mt-2 ml-2 ">
            My Recent Interview Plans
          </h2>

          <ul className="flex flex-wrap gap-3">
            {reports.map((report) => (
              <li
                key={report._id}
                onClick={() => navigate(`/interview/${report._id}`)}
                className="
            flex
            min-w-[250px]
            flex-1
            cursor-pointer
            flex-col
            gap-2
            rounded-lg
            border
            border-[#2a3348]
            bg-[#161b22]
            p-4
            transition
            hover:border-[#ff2d78]
            hover:bg-[#1c2230]
          "
              >
                <h3 className="text-sm font-semibold text-[#e6edf3]">
                  {report.title || "Untitled Position"}
                </h3>

                <p className="text-xs text-[#7d8590]">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <p
                  className={`text-xs font-semibold ${
                    report.matchScore >= 80
                      ? "text-green-400"
                      : report.matchScore >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-wrap justify-center gap-5 pb-4 mt-4">
        <a
          href="#"
          className="text-xs text-[#7d8590] transition hover:text-[#e6edf3]"
        >
          Privacy Policy
        </a>

        <a
          href="#"
          className="text-xs text-[#7d8590] transition hover:text-[#e6edf3]"
        >
          Terms of Service
        </a>

        <a
          href="#"
          className="text-xs text-[#7d8590] transition hover:text-[#e6edf3]"
        >
          Help Center
        </a>
      </footer>
    </div>
  );
}

export default Home;
