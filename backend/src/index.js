import "dotenv/config";
import { server } from "./server.js";
import connectDB from "./db/index.js";
const PORT = parseInt(process.env.PORT, 10) || 5000;

connectDB()
.then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection error: ", err)
});