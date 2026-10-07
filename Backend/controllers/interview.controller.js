import fs from "fs"
import { PDFParse } from "pdf-parse"
import {
    generateInterviewReport,
    generateResumePdfInHtml,
} from "../services/ai.service.js"
import { interViewReportModel } from "../models/interviewReport.model.js"

/**
 * @desc    Generate an interview report based on uploaded resume PDF, job description, and self description
 * @route   POST /api/interview-report/generate
 */
export const generateInterviewReportController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF file is required.",
            })
        }

        const { jobDescription, selfDescription } = req.body

        // Read and parse PDF file uploaded by Multer
        const pdfBuffer = fs.readFileSync(req.file.path)
        const parsedPdf = await new PDFParse(Uint8Array.from(pdfBuffer)).getText()
        const resumeText = parsedPdf.text

        // Clean up uploaded file from disk after processing
        fs.unlinkSync(req.file.path)

        // Generate report using AI service
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            jobDescription,
            selfDescription,
        })

        // Save report to database
        const interviewReport = await interViewReportModel.create({
            user: req.id,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        })

        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            interviewReport,
        })
    } catch (error) {
        // Ensure uploaded file is deleted even if parsing or AI fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }

        console.error("Error generating interview report:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error while generating interview report.",
        })
    }
}

/**
 * @desc    Get a specific interview report by its ID for the authenticated user
 * @route   GET /api/interview-report/:reportId
 */
export const getInterviewReportByIdController = async (req, res) => {
    try {
        const { reportId } = req.params
        const userId = req.id

        const interviewReport = await interViewReportModel.findOne({
            _id: reportId,
            user: userId,
        })

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "No interview report found.",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Found the interview report successfully!",
            interviewReport,
        })
    } catch (error) {
        console.error("Error fetching interview report by ID:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching interview report.",
        })
    }
}

/**
 * @desc    Get all interview report summaries for the authenticated user
 * @route   GET /api/interview-report
 */
export const getAllInterviewReportsController = async (req, res) => {
    try {
        const userId = req.id

        const interviewReport = await interViewReportModel
            .find({ user: userId })
            .select(
                "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
            )

        if (!interviewReport || interviewReport.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No interview reports found.",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Found interview reports successfully!",
            interviewReport,
        })
    } catch (error) {
        console.error("Error fetching user interview reports:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching interview reports.",
        })
    }
}

/**
 * @desc    Generate and download a tailored resume PDF based on an existing interview report
 * @route   GET /api/interview-report/:interviewReportId/resume
 */
export const generateResumePdfController = async (req, res) => {
    try {
        const { interviewReportId } = req.params

        const report = await interViewReportModel.findById(interviewReportId)

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found.",
            })
        }

        const { resume, selfDescription, jobDescription } = report

        const pdfBuffer = await generateResumePdfInHtml({
            resume,
            selfDescription,
            jobDescription,
        })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
            "Content-Length": pdfBuffer.length,
        })

        return res.send(pdfBuffer)
    } catch (error) {
        console.error("Error generating resume PDF:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error while generating resume PDF.",
        })
    }
}