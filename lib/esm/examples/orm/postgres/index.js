import { OpposerDatabase, PostgresDriver } from "../../../orm/index.js";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import Permission from "../models/permission.js";
async function runPostgresExample() {
    console.log("🐘 --- OpposerDatabase: PostgreSQL Example ---");
    const driver = new PostgresDriver({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "password",
        database: "opposer_db",
    });
    const db = new OpposerDatabase(driver, [User, Profile, Permission]);
    try {
        // await db.connect();
        console.log("✅ PostgreSQL initialized.");
        const userRepository = db.getRepository(User);
        console.log("\n🔍 Relationship Overview:");
        console.log("- User 1:1 Profile (joined via User.profile)");
        console.log("- User 1:N Permission (joined via User.permissions)");
        // Example query with relationships (using JSON structure)
        const user = await userRepository.find({
            where: { name: { $il: "Admin%" } },
            select: ["name", "email", "profile", "permissions"],
            pagination: { page: 0, take: 5 }
        });
        console.log("Example query executed on Postgres.");
    }
    catch (error) {
        console.error("❌ Error:", error);
    }
}
runPostgresExample();
