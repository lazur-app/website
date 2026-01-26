import { db } from "./src/db";
import { users } from "./src/db/schema";

async function check() {
    try {
        const result = await db.select().from(users).limit(1);
        console.log("Success: users table exists", result);
    } catch (e) {
        console.error("Error: users table does NOT exist or other error", e);
    }
    process.exit(0);
}

check();
