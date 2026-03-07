"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../orm/index.js");
const user_js_1 = __importDefault(require("../models/user.js"));
const profile_js_1 = __importDefault(require("../models/profile.js"));
const permission_js_1 = __importDefault(require("../models/permission.js"));
async function runPostgresExample() {
    console.log("🐘 --- OpposerDatabase: PostgreSQL Example ---");
    const driver = new index_js_1.PostgresDriver({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "password",
        database: "opposer_db",
    });
    const db = new index_js_1.OpposerDatabase(driver, [user_js_1.default, profile_js_1.default, permission_js_1.default]);
    try {
        // await db.connect();
        console.log("✅ PostgreSQL initialized.");
        const userRepository = db.getRepository(user_js_1.default);
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
