import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  generateResumePdfThunk,
  getInterviewReportByIdThunk,
} from "../../store/slice/interview/interview.thunk.js";

const Interview = () => {
  const dispatch = useDispatch();
  const { interviewId } = useParams();

  const { loading, error, report } = useSelector((state) => state.interview);
  const [activeSection, setActiveSection] = useState("technical");

  useEffect(() => {
    if (interviewId) {
      dispatch(getInterviewReportByIdThunk(interviewId));
    }
  }, [interviewId]);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1217]">
        <p className="text-lg text-white">Loading your interview report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1217]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behavioralQuestions || [];
  const preparationPlan = report?.preparationPlan || [];
  const skillGaps = report?.skillGaps || [];

  const matchScore = report?.matchScore || 0;

  const getSeverityPercentage = (severity) => {
    if (severity === "high") return 100;
    if (severity === "medium") return 60;
    return 30;
  };

  const getSeverityStyle = (severity) => {
    if (severity === "high") {
      return "text-red-400";
    }

    if (severity === "medium") {
      return "text-yellow-400";
    }

    return "text-green-400";
  };

  const handleResumeDownload = async () => {
    if (!interviewId) return;
    await dispatch(generateResumePdfThunk(interviewId));
  };

  return (
    <div className="min-h-screen w-full bg-[#0f1217] px-3 py-5 sm:px-5 sm:py-8">
      {/* Main Container */}
      <div className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl border-2 border-gray-500 bg-[#162030] shadow-2xl shadow-black">
        {/* HEADER */}

        <div className="border-b border-gray-500 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-pink-400">
                AI Interview Report
              </p>

              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                {report?.title || "Full-Stack Developer"}
              </h1>
            </div>

            {/* MATCH SCORE */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-white font-bold">Match Score</p>
              </div>

              <div
                className="radial-progress bg-[#1e2535] text-[#ff2d78]"
                style={{ "--value": matchScore }}
                aria-valuenow={matchScore}
                role="progressbar"
              >
                {matchScore}%
              </div>
            </div>
          </div>
        </div>

        {/* THREE COLUMN LAYOUT */}

        <div className="flex min-h-[650px] flex-col lg:flex-row">
          {/* LEFT SIDEBAR */}

          <aside className="w-full border-b border-gray-500 lg:w-[22%] lg:border-b-0 lg:border-r flex flex-col justify-between">
            <div className="flex flex-col p-4 sm:p-5 lg:sticky lg:top-0">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#7d8590]">
                Interview Sections
              </p>

              {/* Technical */}
              <button
                onClick={() => setActiveSection("technical")}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${
                  activeSection === "technical"
                    ? "bg-[#ff2d78]/10 text-[#ff2d78]"
                    : "text-[#e6edf3] hover:bg-[#1e2535] hover:text-[#ff2d78]"
                }`}
              >
                Technical Questions
              </button>

              {/* Behavioral */}
              <button
                onClick={() => setActiveSection("behavioral")}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${
                  activeSection === "behavioral"
                    ? "bg-[#ff2d78]/10 text-[#ff2d78]"
                    : "text-[#e6edf3] hover:bg-[#1e2535] hover:text-[#ff2d78]"
                }`}
              >
                Behavioral Questions
              </button>

              {/* Roadmap */}
              <button
                onClick={() => setActiveSection("roadmap")}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${
                  activeSection === "roadmap"
                    ? "bg-[#ff2d78]/10 text-[#ff2d78]"
                    : "text-[#e6edf3] hover:bg-[#1e2535] hover:text-[#ff2d78]"
                }`}
              >
                Road Map
              </button>
            </div>
            <div className="p-4 sm:p-5 ">
              <button
                onClick={handleResumeDownload}
                className=" bg-[#ff2d78] rounded-lg flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition
        hover:bg-[#e62569]
        active:scale-[0.98] w-full cursor-pointer "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download Resume
              </button>
            </div>
          </aside>

          {/* CENTER */}

          <main className="w-full lg:w-[50%]">
            {" "}
            <div className="min-h-[650px] p-4 sm:p-6">
              {" "}
              {/* TECHNICAL QUESTIONS */}{" "}
              {activeSection === "technical" && (
                <section>
                  {" "}
                  <div className="mb-5">
                    {" "}
                    <p className="text-xs uppercase tracking-widest text-[#7d8590]">
                      {" "}
                      Technical Assessment{" "}
                    </p>{" "}
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {" "}
                      Technical Questions{" "}
                    </h2>{" "}
                    <p className="mt-2 text-sm leading-6 text-[#7d8590]">
                      {" "}
                      Prepare these questions based on the technical skills
                      identified from your profile and target role.{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="space-y-3">
                    {" "}
                    {technicalQuestions.map((item, index) => (
                      <div
                        key={index}
                        className="collapse collapse-arrow rounded-lg border border-[#2a3348] bg-[#1e2535]"
                      >
                        {" "}
                        {/* DaisyUI checkbox controls open/close */}{" "}
                        <input type="checkbox" /> {/* Question */}{" "}
                        <div className="collapse-title pr-12">
                          {" "}
                          <div className="flex gap-3">
                            {" "}
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff2d78]/10 text-xs font-bold text-[#ff2d78]">
                              {" "}
                              {index + 1}{" "}
                            </span>{" "}
                            <p className="text-sm font-medium leading-6 text-[#e6edf3]">
                              {" "}
                              {item.question}{" "}
                            </p>{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Answer */}{" "}
                        <div className="collapse-content">
                          {" "}
                          <div className="border-t border-[#2a3348] pt-4">
                            {" "}
                            {/* Intention */}{" "}
                            <div>
                              {" "}
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff2d78]">
                                {" "}
                                Intention{" "}
                              </p>{" "}
                              <p className="text-sm leading-6 text-[#7d8590]">
                                {" "}
                                {item.intention}{" "}
                              </p>{" "}
                            </div>{" "}
                            {/* Expected Answer */}{" "}
                            <div className="mt-5">
                              {" "}
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff2d78]">
                                {" "}
                                Expected Answer{" "}
                              </p>{" "}
                              <p className="text-sm leading-6 text-[#e6edf3]">
                                {" "}
                                {item.answer}{" "}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </section>
              )}{" "}
              {/* BEHAVIORAL QUESTIONS */}{" "}
              {activeSection === "behavioral" && (
                <section>
                  {" "}
                  <div className="mb-5">
                    {" "}
                    <p className="text-xs uppercase tracking-widest text-[#7d8590]">
                      {" "}
                      Behavioral Assessment{" "}
                    </p>{" "}
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {" "}
                      Behavioral Questions{" "}
                    </h2>{" "}
                    <p className="mt-2 text-sm leading-6 text-[#7d8590]">
                      {" "}
                      Prepare concise examples using your actual project
                      experience and the STAR structure.{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="space-y-3">
                    {" "}
                    {behavioralQuestions.map((item, index) => (
                      <div
                        key={index}
                        className="collapse collapse-arrow rounded-lg border border-[#2a3348] bg-[#1e2535]"
                      >
                        {" "}
                        {/* DaisyUI checkbox controls open/close */}{" "}
                        <input type="checkbox" /> {/* Question */}{" "}
                        <div className="collapse-title pr-12">
                          {" "}
                          <div className="flex gap-3">
                            {" "}
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff2d78]/10 text-xs font-bold text-[#ff2d78]">
                              {" "}
                              {index + 1}{" "}
                            </span>{" "}
                            <p className="text-sm font-medium leading-6 text-[#e6edf3]">
                              {" "}
                              {item.question}{" "}
                            </p>{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Answer */}{" "}
                        <div className="collapse-content">
                          {" "}
                          <div className="border-t border-[#2a3348] pt-4">
                            {" "}
                            {/* Intention */}{" "}
                            <div>
                              {" "}
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff2d78]">
                                {" "}
                                Intention{" "}
                              </p>{" "}
                              <p className="text-sm leading-6 text-[#7d8590]">
                                {" "}
                                {item.intention}{" "}
                              </p>{" "}
                            </div>{" "}
                            {/* Preparation */}{" "}
                            <div className="mt-5">
                              {" "}
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff2d78]">
                                {" "}
                                Preparation{" "}
                              </p>{" "}
                              <p className="text-sm leading-6 text-[#e6edf3]">
                                {" "}
                                {item.answer}{" "}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </section>
              )}{" "}
              {/* ROAD MAP */}{" "}
              {activeSection === "roadmap" && (
                <section>
                  {" "}
                  <div className="mb-5">
                    {" "}
                    <p className="text-xs uppercase tracking-widest text-[#7d8590]">
                      {" "}
                      Preparation{" "}
                    </p>{" "}
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {" "}
                      Interview Road Map{" "}
                    </h2>{" "}
                    <p className="mt-2 text-sm leading-6 text-[#7d8590]">
                      {" "}
                      Follow this preparation plan to cover the important topics
                      before your interview.{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="space-y-4">
                    {" "}
                    {preparationPlan.map((day) => (
                      <div
                        key={day._id || day.day}
                        className="rounded-lg border border-[#2a3348] bg-[#1e2535] p-4"
                      >
                        {" "}
                        <div className="flex items-center gap-3">
                          {" "}
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff2d78]/10 text-sm font-bold text-[#ff2d78]">
                            {" "}
                            {day.day}{" "}
                          </span>{" "}
                          <div>
                            {" "}
                            <p className="text-xs text-[#7d8590]">
                              {" "}
                              Day {day.day}{" "}
                            </p>{" "}
                            <h3 className="font-semibold text-white">
                              {" "}
                              {day.focus}{" "}
                            </h3>{" "}
                          </div>{" "}
                        </div>{" "}
                        <ul className="mt-4 space-y-2">
                          {" "}
                          {day.tasks.map((task, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm leading-6 text-[#e6edf3]"
                            >
                              {" "}
                              <span className="text-[#ff2d78]">•</span>{" "}
                              <span>{task}</span>{" "}
                            </li>
                          ))}{" "}
                        </ul>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </section>
              )}{" "}
            </div>{" "}
          </main>

          {/* ========================================================= */}
          {/* RIGHT SKILL GAPS */}
          {/* ========================================================= */}

          <aside className="w-full border-t border-gray-500 lg:w-[30%] lg:border-l lg:border-t-0">
            <div className="p-5 sm:p-6">
              <p className="text-xs uppercase tracking-widest text-[#7d8590]">
                Analysis
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">Skill Gaps</h2>

              <p className="mt-2 text-sm leading-6 text-[#7d8590]">
                Skills identified from your profile that you should focus on
                before the interview.
              </p>

              {/* Skill Gap List */}
              <div className="mt-5 space-y-3">
                {skillGaps.map((gap, index) => {
                  const severityPercentage = getSeverityPercentage(
                    gap.severity,
                  );

                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-[#2a3348] bg-[#1e2535] p-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Radial Progress */}
                        <div
                          className={`radial-progress shrink-0 ${getSeverityStyle(
                            gap.severity,
                          )}`}
                          style={{
                            "--value": severityPercentage,
                            "--size": "3rem",
                            "--thickness": "4px",
                          }}
                          aria-valuenow={severityPercentage}
                          role="progressbar"
                        >
                          <span className="text-[10px] font-bold">
                            {severityPercentage}%
                          </span>
                        </div>

                        {/* Skill */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-5 text-[#e6edf3]">
                            {gap.skill}
                          </p>

                          <p
                            className={`mt-1 text-[10px] font-semibold uppercase ${getSeverityStyle(
                              gap.severity,
                            )}`}
                          >
                            {gap.severity} priority
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 rounded-lg border border-[#2a3348] bg-[#1b2230] p-4">
                <p className="text-xs font-semibold text-white">Severity</p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />

                    <span className="text-xs text-[#7d8590]">
                      High priority — 100%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />

                    <span className="text-xs text-[#7d8590]">
                      Medium priority — 60%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />

                    <span className="text-xs text-[#7d8590]">
                      Low priority — 30%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap justify-center gap-5 pb-4 pt-5">
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
};

export default Interview;
