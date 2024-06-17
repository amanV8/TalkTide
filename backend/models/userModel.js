const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default: "https://i.pinimg.com/564x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg",
        },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;