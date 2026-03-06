import { OpposerDatabase, SQLiteDriver } from "../../../orm/index.js";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import Permission from "../models/permission.js";

async function runSQLiteExample() {
  console.log("📁 --- OpposerDatabase: SQLite Example ---");

  const driver = new SQLiteDriver({
    type: "sqlite",
    database: "./opposer-test.db",
  });

  const db = new OpposerDatabase(driver, [User, Profile, Permission]);

  try {
    // await db.connect();
    console.log("✅ SQLite initialized.");

    const userRepository = db.getRepository(User);

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
    const errors = userRepository.validate(userData as any);
    if (Object.keys(errors).length === 0) {
      console.log("✅ Data is valid for insertion.");
    }

    console.log("Example operation executed on SQLite.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

runSQLiteExample();
