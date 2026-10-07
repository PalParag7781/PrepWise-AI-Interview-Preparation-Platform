import express from "express"
import { Router } from "express"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js"
import { generateInterviewReportController, generateResumePdfController, getAllInterviewReportsController, getInterviewReportByIdController, } from "../controllers/interview.controller.js"
import { upload } from "../Middlewares/multer.middleware.js"

export const interviewRouter = Router()

/**
 * @route   POST /api/interview
 * @desc    Generate interview report based on resume, job description, and self-description
 */
interviewRouter.post(
    "/",
    isAuthenticated,
    upload.single("resume"),
    generateInterviewReportController
)

/**
 * @route   GET /api/interview/allReports
 * @desc    Get all interview report summaries for the authenticated user
 */
interviewRouter.get(
    "/allReports",
    isAuthenticated,
    getAllInterviewReportsController
)

/**
 * @route   GET /api/interview/report/:reportId
 * @desc    Get a specific interview report by ID
 */
interviewRouter.get(
    "/report/:reportId",
    isAuthenticated,
    getInterviewReportByIdController
)

/**
 * @route   POST /api/interview/resume/pdf/:interviewReportId
 * @desc    Generate and download a tailored resume PDF based on an interview report
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    isAuthenticated,
    generateResumePdfController
)