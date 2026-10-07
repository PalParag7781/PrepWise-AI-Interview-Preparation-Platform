import { createSlice } from "@reduxjs/toolkit"
import { generateInterviewReportThunk, getAllInterviewReportsThunk, getInterviewReportByIdThunk } from "./interview.thunk.js"




const initialState = {
    loading: false,
    report: null,
    reports: [],
    error: null,
    buttonLoading: false
}

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            // Getting Interview Report 
            .addCase(generateInterviewReportThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
                state.buttonLoading = true
            })
            .addCase(generateInterviewReportThunk.fulfilled, (state, action) => {
                state.loading = false
                state.report = action.payload.interviewReport
                state.buttonLoading = false
            })
            .addCase(generateInterviewReportThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.buttonLoading = false
            })

            // Get report by ID
            .addCase(getInterviewReportByIdThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
                state.report = null;
            })
            .addCase(getInterviewReportByIdThunk.fulfilled, (state, action) => {
                state.loading = false
                state.report = action.payload.interviewReport
            })
            .addCase(getInterviewReportByIdThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.report = null
            })

            // Get all reports
            .addCase(getAllInterviewReportsThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllInterviewReportsThunk.fulfilled, (state, action) => {
                state.loading = false
                state.reports = action.payload.interviewReport
            })
            .addCase(getAllInterviewReportsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default interviewSlice.reducer