import mongoose from "mongoose";


const blackListingTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist"]
    },

})

const blackListingTokenModel = mongoose.model("blackListingTokenModels", blackListingTokenSchema)

export default blackListingTokenModel