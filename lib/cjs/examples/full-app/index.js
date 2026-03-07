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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../../server/index.js"));
const index_js_2 = __importDefault(require("../../server/core/index.js"));
const author_js_1 = __importDefault(require("./models/author.js"));
const book_js_1 = __importDefault(require("./models/book.js"));
const category_js_1 = __importDefault(require("./models/category.js"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// @ts-ignore
const _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : // @ts-ignore
        path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
async function runFullExample() {
    console.log('🚀 Initializing Full Opposer Example...');
    // 1. Setup Environment
    process.env.OPPOSER_PORT = '4000';
    process.env.OPPOSER_DATABASE_TYPE = 'sqlite';
    process.env.OPPOSER_DATABASE_NAME = './full-app.db';
    try {
        // 2. Start Opposer Server
        // Passing the local models and schedules path so initialization can find our entities
        const { initialize } = await (0, index_js_1.default)({
            cors: { origin: '*' },
            models: path_1.default.resolve(_dirname, 'models'),
            schedules: path_1.default.resolve(_dirname, 'schedules'),
        });
        // 3. Populate Initial Data
        const db = index_js_2.default.getContext('db');
        console.log('📝 Populating initial data...');
        const authorRepo = db.getRepository(author_js_1.default);
        const categoryRepo = db.getRepository(category_js_1.default);
        const bookRepo = db.getRepository(book_js_1.default);
        //@ts-ignore
        const { randomUUID } = await Promise.resolve().then(() => __importStar(require('crypto')));
        // Insert Author
        let author = await authorRepo.findOne({ where: { name: 'J.K. Rowling' } });
        if (!author) {
            author = await authorRepo.insert({ id: randomUUID(), name: 'J.K. Rowling', nationality: 'British' });
        }
        // Insert Category
        let category = await categoryRepo.findOne({ where: { title: 'Fantasy' } });
        if (!category) {
            category = await categoryRepo.insert({ id: randomUUID(), title: 'Fantasy' });
        }
        // Insert Books
        const bookCount = await bookRepo.count({});
        if (bookCount === 0) {
            await bookRepo.insert({ id: randomUUID(), title: "Harry Potter and the Philosopher's Stone", price: 39.9, author: author.id, category: category.id });
            await bookRepo.insert({ id: randomUUID(), title: 'Harry Potter and the Chamber of Secrets', price: 42.5, author: author.id, category: category.id });
            console.log('✅ Data populated.');
        }
        // 4. Start listening
        initialize();
        console.log('\n--- Example Info ---');
        console.log('API URL: http://localhost:4000/opposer');
        console.log('Playground Map: http://localhost:4000/opposer-map.json');
        console.log('Playground Status: http://localhost:4000/playground');
        console.log('--------------------\n');
    }
    catch (error) {
        console.error('❌ Failed to start example:', error);
    }
}
runFullExample();
