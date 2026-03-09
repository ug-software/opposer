import fs from 'fs';
import path from 'path';

export const command = "init";
export const desc = "Scaffold a new Opposer project structure.";

export const builder = {};

export const handler = async () => {
  const root = process.cwd();
  
  // 1. Create Directories
  const dirs = [
    'src',
    'src/controllers',
    'src/models',
    'src/schedules'
  ];

  console.log('--> Creating project structure...');
  
  dirs.forEach(dir => {
    const fullPath = path.join(root, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`   --> Created ${dir}/`);
    } else {
      console.log(`   --> Skipped ${dir}/ (already exists)`);
    }
  });

  // 2. Create Files Content
  
  // src/index.ts
  const indexTsContent = `import { Server } from "opposer";

const app = await Server({
    models: "./src/models",
    controllers: "./src/controllers",
    schedules: "./src/schedules",
    cors: { origin: "*" }
});

app.initialize();
`;

  // src/controllers/health.ts
  const healthControllerContent = `import { Controller, Method, Success, IsPublicMethod } from "opposer/server";

@Controller("health")
export default class HealthController {
    @IsPublicMethod()
    @Method()
    check() {
        return Success({ 
            status: "online", 
            timestamp: new Date() 
        });
    }
}
`;

  // src/models/example.ts
  const exampleModelContent = `import { Entity, PrimaryColumn, Field, f, CreateDateColumn } from "opposer/orm";

@Entity("examples", "Example Entity")
export default class Example {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Field(() => f().string().required())
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
`;

  // opposer-settings.json
  const settingsContent = `{
  "port": 3838,
  "url": "/opposer",
  "database": {
    "type": "sqlite",
    "database": "./database.sqlite",
    "logging": true
  },
  "auth": false,
  "logger": true
}`;

  // .env
  const envContent = `# --- Server ---
OPPOSER_PORT=3838

# --- Database ---
# Options: postgres, mysql, sqlite
OPPOSER_DATABASE_TYPE=sqlite
# For SQLite use path (e.g., ./db.sqlite), for others use DB name
OPPOSER_DATABASE_NAME=./database.sqlite
OPPOSER_DATABASE_LOGGING=true

# DB Connection (Not needed for SQLite)
# OPPOSER_DATABASE_HOST=localhost
# OPPOSER_DATABASE_PORT=5432
# OPPOSER_DATABASE_USER=root
# OPPOSER_DATABASE_PASSWORD=secret

# --- Security & Auth ---
# Set to 'true' in settings.json or enable via code to use
# OPPOSER_JWT_ACCESS=generate-secure-random-key-here
# OPPOSER_JWT_REFRESH=generate-secure-random-key-here

# Initial Admin User
# OPPOSER_MANAGER_LOGIN=admin
# OPPOSER_MANAGER_PASSWORD=admin
# OPPOSER_MANAGER_FIRST_NAME=System
# OPPOSER_MANAGER_LAST_NAME=Admin
`;

  // 3. Write Files
  const files = [
    { path: 'src/index.ts', content: indexTsContent },
    { path: 'src/controllers/health.ts', content: healthControllerContent },
    { path: 'src/models/example.ts', content: exampleModelContent },
    { path: 'opposer-settings.json', content: settingsContent },
    { path: '.env', content: envContent }
  ];

  files.forEach(file => {
    const fullPath = path.join(root, file.path);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, file.content);
      console.log(`   --> Created ${file.path}`);
    } else {
      console.log(`   --> Skipped ${file.path} (already exists)`);
    }
  });

  // 4. Update package.json
  const packageJsonPath = path.join(root, 'package.json');
  let packageJson = {};

  if (fs.existsSync(packageJsonPath)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } else {
    packageJson = {
      name: path.basename(root),
      version: "1.0.0",
      type: "module",
      description: "Opposer project",
      main: "src/index.ts",
      dependencies: {},
      devDependencies: {}
    };
  }

  packageJson.scripts = {
    ...(packageJson.scripts || {}),
    "dev": "npx tsx src/index.ts",
    "build": "npx opposer build"
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   --> Updated package.json with "dev" and "build" scripts.');

  console.log('\n--> Project initialized successfully!');
  console.log('--> Run "npm run dev" to start your server.');
};
