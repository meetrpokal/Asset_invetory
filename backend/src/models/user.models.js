import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { type } from "os";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is mandatory!"]
        },
        role: {
            type: String,
            enum: ['citizen', 'admin', 'officer', 'SUPER_ADMIN', 'ROAD_ADMIN', 'FINANCE_OFFICER', 'INSPECTION_OFFICER', 'CONTRACTOR', 'TECHNICIAN', 'CITIZEN'],
            default: 'CITIZEN'
        },
        googleId: {
            type: String,
            default: null,
            sparse: true,
        },
        latitude: Number,
        longitude: Number,
        address: String,
        profileImage: {
            type: String,
            required: false,
            default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        
        complaints: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'complaint'
            }
        ],
        officer_category: {
            type: String,
            default: 'Road',
        },
        user_level: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'department',
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// userSchema.

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    // Short lived access token
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function () {
    // Short lived refresh token
    return jwt.sign(
        {
            _id: this._id,
        }
    ,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

export const User = mongoose.model('user', userSchema);