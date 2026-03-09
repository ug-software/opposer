"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../orm/index.js");
const user_js_1 = __importDefault(require("../models/user.js"));
const profile_js_1 = __importDefault(require("../models/profile.js"));
const permission_js_1 = __importDefault(require("../models/permission.js"));
async function runSQLiteExample() {
    console.log("📁 --- OpposerDatabase: SQLite Example ---");
    const driver = new index_js_1.SQLiteDriver({
        type: "sqlite",
        database: "./opposer-test.db",
    });
    const db = new index_js_1.OpposerDatabase(driver, [user_js_1.default, profile_js_1.default, permission_js_1.default]);
    try {
        // await db.connect();
        console.log("✅ SQLite initialized.");
        const userRepository = db.getRepository(user_js_1.default);
        console.log("\n🔍 Relationship Overview:");
        console.log("- User 1:1 Profile (joined via User.profile)");
        console.log("- User 1:N Permission (joined via User.permissions)");
        // Validation check for relations
        const userData = {
            name: "Lite User",
            email: "lite@sqlite.org",
            profile: { bio: "My life in a small file." }
        };
        console.log("Validating user data with nested profile structure.");
        const errors = userRepository.validate(userData);
        if (Object.keys(errors).length === 0) {
            console.log("✅ Data is valid for insertion.");
        }
        console.log("Example operation executed on SQLite.");
    }
    catch (error) {
        console.error("❌ Error:", error);
    }
}
runSQLiteExample();
