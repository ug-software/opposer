"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../orm/index.js");
const user_js_1 = __importDefault(require("../models/user.js"));
const profile_js_1 = __importDefault(require("../models/profile.js"));
const permission_js_1 = __importDefault(require("../models/permission.js"));
async function runMySQLExample() {
    console.log("🐬 --- OpposerDatabase: MySQL Example ---");
    const driver = new index_js_1.MySQLDriver({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "opposer_db",
    });
    const db = new index_js_1.OpposerDatabase(driver, [user_js_1.default, profile_js_1.default, permission_js_1.default]);
    try {
        // await db.connect();
        console.log("✅ MySQL initialized.");
        const userRepository = db.getRepository(user_js_1.default);
        console.log("\n🔍 Relationship Overview:");
        console.log("- User 1:1 Profile (joined via User.profile)");
        console.log("- User 1:N Permission (joined via User.permissions)");
        // Example search using Opposer's JSON query builder (mapped to MySQL ?)
        const results = await userRepository.find({
            where: {
                $or: [
                    { name: "Admin" },
                    { email: { $il: "root@%" } }
                ]
            },
            select: ["name", "email"]
        });
        console.log("Example query executed on MySQL.");
    }
    catch (error) {
        console.error("❌ Error:", error);
    }
}
runMySQLExample();
