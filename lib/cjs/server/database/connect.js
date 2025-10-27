"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.default = default_1;
const typeorm_1 = require("typeorm");
const system = __importStar(require("../../system/index.js"));
var settings = system.getSettingsFile();
// false conection for not error...
var db = new typeorm_1.DataSource({
    database: ":memory",
    type: "postgres",
    entities: [],
});
exports.db = db;
async function default_1(props) {
    var entities = (await system.getAllSchemas()).map((x) => x.entity);
    var databaseConnection = new typeorm_1.DataSource({
        ...props,
        entities,
    });
    //connect and repass for unique instance variable.
    await databaseConnection.initialize();
    exports.db = db = databaseConnection;
    //create manager access;
    if (settings.auth) {
        console.log("-> Creating manager access.");
        try {
            var userSchema = entities.find((x) => x.name === "User");
            var userRepository = db.getRepository(userSchema);
            let login = process.env.MANAGER_LOGIN;
            if (!login) {
                login = settings.manager.login;
            }
            let firstName = process.env.MANAGER_FIRST_NAME;
            if (!firstName) {
                firstName = settings.manager.firstName;
            }
            let lastName = process.env.MANAGER_LAST_NAME;
            if (!lastName) {
                lastName = settings.manager.lastName;
            }
            let password = process.env.MANAGER_PASSWORD;
            if (!password) {
                password = settings.manager.password;
            }
            var manager = userRepository.create({
                fn: firstName,
                ln: lastName,
                lg: login,
                ps: password,
                rl: [
                    {
                        sm: "all",
                        mt: "all",
                    },
                ],
            });
            if (!(await userRepository.findOne({ where: { lg: manager.lg } }))) {
                userRepository.save(manager);
            }
        }
        catch (error) {
            console.error("[database] - Manager don't created, verify manager data in settings (opposer-settings) or in env.");
        }
    }
    return db;
}
