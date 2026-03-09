import { OpposerDatabase } from './src/orm/opposer.js';
import { SQLiteDriver } from './src/orm/driver/sqlite.js';
import Book from './src/examples/full-app/models/book.js';
import Author from './src/examples/full-app/models/author.js';
import Category from './src/examples/full-app/models/category.js';
import { MetadataStore } from './src/orm/metadata.js';
import crypto from 'crypto';

async function runRepro() {
  const db = new OpposerDatabase({
    type: 'sqlite',
    database: ':memory:',
    logging: true,
  });

  await db.connect();

  const driver = db.getDriver();
  
  // Register entities manually because we are not using the full server initialization
  // Actually they should be registered when imported because of decorators
  
  const authorRepo = db.getRepository(Author);
  const categoryRepo = db.getRepository(Category);
  const bookRepo = db.getRepository(Book);

  // Sync schemas
  await driver.createTable(MetadataStore.getEntity(Author)!, MetadataStore.getFields(Author));
  await driver.createTable(MetadataStore.getEntity(Category)!, MetadataStore.getFields(Category));
  await driver.createTable(MetadataStore.getEntity(Book)!, MetadataStore.getFields(Book));

  console.log('📝 Populating data...');
  const authorId = crypto.randomUUID();
  await authorRepo.insert({ id: authorId, name: 'J.K. Rowling', nationality: 'British' });
  
  const categoryId = crypto.randomUUID();
  await categoryRepo.insert({ id: categoryId, title: 'Fantasy' });

  await bookRepo.insert({ 
    id: crypto.randomUUID(), 
    title: "Harry Potter and the Philosopher's Stone", 
    price: 39.9, 
    author: authorId as any, 
    category: categoryId as any 
  } as any);

  console.log('\n--- Test 1: find with simple relation ---');
  try {
    const books = await (bookRepo as any).find({ relation: ["author"] });
    console.log('Books with author:', JSON.stringify(books, null, 2));
  } catch (e: any) {
    console.log('Test 1 Failed:', e.message);
  }

  console.log('\n--- Test 2: find with relation and select ---');
  try {
    const books = await (bookRepo as any).find({ 
      relation: [{ model: "author", select: ["name"] }] 
    });
    console.log('Books with author (name only):', JSON.stringify(books, null, 2));
  } catch (e: any) {
    console.log('Test 2 Failed:', e.message);
  }

  console.log('\n--- Test 3: find with where on relation property ---');
  try {
    const books = await (bookRepo as any).find({ 
      where: { "author.name": "J.K. Rowling" } 
    });
    console.log('Books by J.K. Rowling:', JSON.stringify(books, null, 2));
  } catch (e: any) {
    console.log('Test 3 Failed:', e.message);
  }

  await db.disconnect();
}

runRepro();
