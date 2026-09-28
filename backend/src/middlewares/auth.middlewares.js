import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import {ApiError} from "../../utils/ApiError.js"
import {asyncHandler} from "../../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async(req, _, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized");

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // console.log("User found:", user.role);

        if (!user) throw new ApiError(401, "Unauthorized");

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const requireRole = (...allowedRoles) => {
    return (req, _, next) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized access - Login required");
        }

        const userRole = (req.user.role || "").toUpperCase();
        const uppercaseAllowed = allowedRoles.map((r) => r.toUpperCase());

        const isMatch = uppercaseAllowed.some((role) => {
            if (role === userRole) return true;
            if (role === "ADMIN" && (userRole === "SUPER_ADMIN" || userRole === "ADMIN")) return true;
            if (role === "ROAD_OFFICER" && (userRole === "OFFICER" || userRole === "ROAD_OFFICER" || userRole === "INSPECTION_OFFICER")) return true;
            if (role === "CUSTOMER" && (userRole === "CITIZEN" || userRole === "CUSTOMER")) return true;
            if (role === "CONTRACTOR" && userRole === "CONTRACTOR") return true;
            return false;
        });

        if (!isMatch) {
            throw new ApiError(403, `Forbidden: Role '${req.user.role}' is not authorized to access this resource.`);
        }

        next();
    };
};