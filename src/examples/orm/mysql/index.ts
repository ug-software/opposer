import { OpposerDatabase, MySQLDriver } from "../../../orm/index.js";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import Permission from "../models/permission.js";

async function runMySQLExample() {
  console.log("🐬 --- OpposerDatabase: MySQL Example ---");

  const driver = new MySQLDriver({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "opposer_db",
  });

  const db = new OpposerDatabase(driver, [User, Profile, Permission]);

  try {
    // await db.connect();
    console.log("✅ MySQL initialized.");

    const userRepository = db.getRepository(User);

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
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

runMySQLExample();
