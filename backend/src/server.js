import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: "http://localhost:5173",
    // origin: "*",
    // origin: "*",
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
import complaintRouter from "./routes/complaint.routes.js";
import escalationRouter from "./routes/escalation.routes.js";
import departmentRouter from "./routes/department.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import auditRouter from "./routes/audit.routes.js";
import evidenceRouter from "./routes/evidence.routes.js";
import historyRouter from "./routes/history.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import officerRouter from "./routes/officer.routes.js";
import teamRouter from "./routes/team.routes.js";
import assetRouter from "./routes/asset.routes.js";
import maintenanceRouter from "./routes/maintenance.routes.js";
import roadRouter from "./routes/road.routes.js";
import roadProjectRouter from "./routes/roadProject.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import tenderRouter from "./routes/tender.routes.js";
import contractorRouter from "./routes/contractor.routes.js";
import inspectionRouter from "./routes/inspection.routes.js";

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
    }
})

io.on("connection", (socket) => {
    // console.log("A user connected: ", socket.id);

    socket.on("disconnect", () => {
        // console.log("A user disconnected", socket.id);
    });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/complaints", complaintRouter);
app.use("/api/v1/escalations", escalationRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/feedbacks", feedbackRouter);
app.use("/api/v1/evidences", evidenceRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/officer", officerRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/assets", assetRouter);
app.use("/api/v1/maintenance", maintenanceRouter);
app.use("/api/v1/roads", roadRouter);
app.use("/api/v1/road-projects", roadProjectRouter);
app.use("/api/v1/budget", budgetRouter);
app.use("/api/v1/tenders", tenderRouter);
app.use("/api/v1/contractors", contractorRouter);
app.use("/api/v1/inspections", inspectionRouter);
app.use("/api/v1/audit-logs", auditRouter);
app.use("/api/v1/audit-logs", auditRouter);


import { errorHandler } from "./middlewares/error.middlewares.js";
app.use(errorHandler);

export { app, server, io };
