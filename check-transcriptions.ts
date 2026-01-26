import { db } from "./src/db";
import { transcriptions } from "./src/db/schema";

async function check() {
    try {
        const all = await db.select().from(transcriptions);
        console.log("Transcriptions in DB:", all);
    } catch (e) {
        console.error("Error checking transcriptions:", e);
    }
    process.exit(0);
}

check();
