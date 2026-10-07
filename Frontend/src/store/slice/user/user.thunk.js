import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../axiosInstance/axiosInstance";
import { toast } from "sonner"
import axios from "axios";



export const loginUserThunk = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {

    try {
        const response = await axiosInstance.post("/login", {
            email, password
        })

        if (response.data) {
            localStorage.setItem("accessToken", response.data.accessToken)
        }

        toast.success("Login Successfully")

        return response.data
    } catch (error) {
        const errorOutput = error.response.data.message
        toast.error(errorOutput);
        return rejectWithValue(errorOutput)
    }
})

export const registerUserThunk = createAsyncThunk("/user/register", async ({ userName, email, password }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/register", { userName, email, password })

        toast.success("User registered successfully")
        return response.data
    } catch (error) {
        const errorOutput = error.response.data.message
        return rejectWithValue(errorOutput)
    }
})

export const logoutUserThunk = createAsyncThunk("/user/logout", async (__, { rejectWithValue }) => {

    const accessToken = localStorage.getItem("accessToken")
    try {
        const response = await axiosInstance.post("/logout", null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        localStorage.removeItem("accessToken");
        toast.success("logged out successfully ")

    } catch (error) {
        const errorOutput = error.response.data.message
        return rejectWithValue(errorOutput)
    }

})

export const getMeUserThunk = createAsyncThunk("user/getMe", async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken")
    try {

        const response = await axiosInstance.get("/getMe", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data

    } catch (error) {
        const errorOutput = error.response.data.message
        return rejectWithValue(errorOutput)
    }
})