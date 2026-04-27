import { config } from 'dotenv'; config()
import app from './src/app.js';

import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 4000

const startServer = async () => {
    try {
        await connectDB();
        // console.log("✅ Connected to MongoDB",process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`🚀 server is running on ${PORT}`);
        })

    }
    catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}

startServer();