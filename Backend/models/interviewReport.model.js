import mongoose from "mongoose"
import { number } from "zod"

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer question is required"]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer question is required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        required: [true, "Severity is required"],
        enum: ["low", "medium", "high"]
    },
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job desctiption is necessary"]
    },
    resumeText: {
        type: String,
    },
    selfDescription: {

        type: String,
    },
    matchScore: {
        type: number,
        min: 0,
        max: 100
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    preparationPlan: [preparationPlanSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
}, {
    timestamps: true
})

export const interViewReportModel = mongoose.model("InterviewReport", interviewReportSchema)