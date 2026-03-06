import Server from '../../server/index.js';
import opposerServer from '../../server/core/index.js';
import { OpposerDatabase } from '../../orm/index.js';
import Author from './models/author.js';
import Book from './models/book.js';
import Category from './models/category.js';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : // @ts-ignore
      path.dirname(fileURLToPath(import.meta.url));

async function runFullExample() {
  console.log('🚀 Initializing Full Opposer Example...');

  // 1. Setup Environment
  process.env.OPPOSER_PORT = '4000';
  process.env.OPPOSER_DATABASE_TYPE = 'sqlite';
  process.env.OPPOSER_DATABASE_NAME = './full-app.db';

  try {
    // 2. Start Opposer Server
    // Passing the local models and schedules path so initialization can find our entities
    const { initialize } = await Server({
      cors: { origin: '*' },
      models: path.resolve(_dirname, 'models'),
      schedules: path.resolve(_dirname, 'schedules'),
    });

    // 3. Populate Initial Data
    const db = opposerServer.getContext<OpposerDatabase>('db');

    console.log('📝 Populating initial data...');
    const authorRepo = db.getRepository(Author);
    const categoryRepo = db.getRepository(Category);
    const bookRepo = db.getRepository(Book);

    //@ts-ignore
    const { randomUUID } = await import('crypto');

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
      await bookRepo.insert({ id: randomUUID(), title: "Harry Potter and the Philosopher's Stone", price: 39.9, author: author.id as any, category: category.id as any } as any);
      await bookRepo.insert({ id: randomUUID(), title: 'Harry Potter and the Chamber of Secrets', price: 42.5, author: author.id as any, category: category.id as any } as any);
      console.log('✅ Data populated.');
    }

    // 4. Start listening
    initialize();

    console.log('\n--- Example Info ---');
    console.log('API URL: http://localhost:4000/opposer');
    console.log('Playground Map: http://localhost:4000/opposer-map.json');
    console.log('Playground Status: http://localhost:4000/playground');
    console.log('--------------------\n');
  } catch (error) {
    console.error('❌ Failed to start example:', error);
  }
}

runFullExample();
