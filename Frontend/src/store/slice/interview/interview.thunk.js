
import { createAsyncThunk } from '@reduxjs/toolkit';
import { interviewAxios } from '../../../axiosInstance/axiosInstance.js';


export const generateInterviewReportThunk = createAsyncThunk("interview/report", async ({ resume, selfDescription, jobDescription }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken")

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)

    try {
        const response = await interviewAxios.post("/", formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data
    } catch (error) {
        console.log("THUNK STATUS:", error.response?.status);
        console.log("THUNK DATA:", error.response?.data);
        console.log("THUNK ERROR:", error);

        const errorOutput =
            error.response?.data?.message ||
            error.message ||
            "Failed to generate interview report";

        return rejectWithValue(errorOutput);
    }
})


export const getInterviewReportByIdThunk = createAsyncThunk("interview/report/id", async (reportId, { rejectWithValue }) => {

    const accessToken = localStorage.getItem("accessToken")
    try {
        const response = await interviewAxios.get(`/report/${reportId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    } catch (error) {
        const errorOutput = error.response?.data?.message
        return rejectWithValue(errorOutput || "Failed to generate interview report by Id")
    }
})

export const getAllInterviewReportsThunk = createAsyncThunk("/interview/getAllReport", async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken")
    try {
        const response = await interviewAxios.get("/allReports", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }
    catch (error) {
        const errorOutput = error.response?.data?.message
        return rejectWithValue(errorOutput || "Failed to generate all the interview report")
    }

})


export const generateResumePdfThunk = createAsyncThunk("interview/generateResumePdf", async (interviewId, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken")
    try {
        const response = await interviewAxios.post(`/resume/pdf/${interviewId}`, null, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const url = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/pdf",
            })
        );

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute(
            "download",
            `resume_${interviewId}.pdf`
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            "Failed to generate resume PDF"
        );
    }


})
