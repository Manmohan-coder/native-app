import { config } from 'dotenv'; config()
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8",'1.1.1.1'])

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import makeAdmin from './src/scripts/makeAdmin.js';

const PORT = process.env.PORT || 4000

const startServer = async () => {
    try {
        await connectDB();
        await makeAdmin()
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