import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function check() {
    try {
        const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        console.log("Tables in public schema:", result);
    } catch (e) {
        console.error("Error checking tables:", e);
    }
    process.exit(0);
}

check();
