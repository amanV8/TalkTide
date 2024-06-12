const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        pics: {
            type: String,
            required: true,
            default: "https://i.pinimg.com/564x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

model.exports = User;