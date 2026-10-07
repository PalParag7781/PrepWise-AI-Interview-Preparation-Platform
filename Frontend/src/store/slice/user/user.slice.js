import { createSlice } from "@reduxjs/toolkit"
import { getMeUserThunk, loginUserThunk, logoutUserThunk, registerUserThunk } from "./user.thunk"

const initialState = {
    isAuthenticated: false,
    userProfile: null,
    buttonLoading: false,
    screenLoading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // login
        builder

            .addCase(loginUserThunk.pending, (state, action) => {
                console.log("Pending Login")
                state.buttonLoading = true
            })

            .addCase(loginUserThunk.fulfilled, (state, action) => {
                console.log("Login is fulfilled")
                state.buttonLoading = false
                state.isAuthenticated = true
                state.userProfile = action.payload.user
            })

            .addCase(loginUserThunk.rejected, (state, action) => {
                console.log("Login is rejected")
                state.buttonLoading = false
                state.isAuthenticated = false
                state.userProfile = null
            })

            // Register
            .addCase(registerUserThunk.pending, (state, action) => {
                console.log("Pending register")
                state.buttonLoading = true
            })

            .addCase(registerUserThunk.fulfilled, (state, action) => {
                console.log("Registration is fulfilled")
                state.buttonLoading = false
            })

            .addCase(registerUserThunk.rejected, (state, action) => {
                console.log("Registration is rejected")
                state.buttonLoading = false
            })

            // logout

            .addCase(logoutUserThunk.pending, (state, action) => {
                console.log("Pending logout")
                state.buttonLoading = true

            })

            .addCase(logoutUserThunk.fulfilled, (state, action) => {
                console.log("Logout is fulfilled")
                state.buttonLoading = false
                state.isAuthenticated = false
                state.userProfile = null
            })

            .addCase(logoutUserThunk.rejected, (state, action) => {
                console.log("Logout is rejected")
                state.buttonLoading = false
                state.isAuthenticated = true

            })

            //getMe
            .addCase(getMeUserThunk.pending, (state, action) => {
                console.log("Pending getting user")
                state.screenLoading = true

            })

            .addCase(getMeUserThunk.fulfilled, (state, action) => {
                console.log("Getting user is fulfilled")
                state.screenLoading = false
                state.isAuthenticated = true
                state.userProfile = action.payload.user

            })

            .addCase(getMeUserThunk.rejected, (state, action) => {
                console.log("Getting user is rejected")
                state.screenLoading = false
                state.isAuthenticated = false
                state.userProfile = null
            })
    }
})

export default userSlice.reducer