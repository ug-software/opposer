import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { OpposerDatabase } from '../../src/orm/opposer.js';
import { SQLiteDriver } from '../../src/orm/driver/sqlite.js';
import Book from '../../src/examples/full-app/models/book.js';
import Author from '../../src/examples/full-app/models/author.js';
import Category from '../../src/examples/full-app/models/category.js';
import crypto from 'crypto';

describe('ORM Integrity', () => {
  let db: OpposerDatabase;
  let driver: SQLiteDriver;
  let authorRepo: any;
  let bookRepo: any;
  let categoryRepo: any;

  beforeAll(async () => {
    driver = new SQLiteDriver({
      type: 'sqlite',
      database: ':memory:',
      logging: false,
    });
    db = new OpposerDatabase(driver, [Author, Book, Category]);
    await db.connect();
    
    authorRepo = db.getRepository(Author);
    bookRepo = db.getRepository(Book);
    categoryRepo = db.getRepository(Category);
  });

  afterAll(async () => {
    await driver.disconnect();
  });

  test('should correctly handle one-to-many relations without duplicates', async () => {
    const authorId = crypto.randomUUID();
    const catId = crypto.randomUUID();

    await authorRepo.insert({ id: authorId, name: 'Author 1' });
    await categoryRepo.insert({ id: catId, title: 'Category 1' });

    await bookRepo.insert({ id: crypto.randomUUID(), title: 'Book 1', author: authorId as any, category: catId as any } as any);
    await bookRepo.insert({ id: crypto.randomUUID(), title: 'Book 2', author: authorId as any, category: catId as any } as any);

    const authors = await authorRepo.find({ relation: ['books'] });
    const author = authors.find((a: any) => a.id === authorId);

    expect(authors.length).toBe(1);
    expect(Array.isArray(author.books)).toBe(true);
    expect(author.books.length).toBe(2);
  });

  test('should correctly handle one-to-many relations with specific select', async () => {
    const authorId = crypto.randomUUID();
    await authorRepo.insert({ id: authorId, name: 'Specific Author' });
    await bookRepo.insert({ id: crypto.randomUUID(), title: 'Specific Book', author: authorId as any } as any);

    const authors = await authorRepo.find({ 
      where: { id: authorId },
      relation: [{ model: 'books', select: ['title'] }] 
    });
    
    expect(authors.length).toBe(1);
    expect(authors[0].books).toBeDefined();
    expect(authors[0].books.length).toBe(1);
    expect(authors[0].books[0].title).toBe('Specific Book');
  });

  test('should filter using complex operators like $in', async () => {
    const results = await bookRepo.find({ 
      where: { 
        title: { $in: ['Book 1', 'Book 2'] } 
      } 
    });
    expect(results.length).toBe(2);
  });

  test('should aggregate values correctly', async () => {
    const result = await bookRepo.count({});
    expect(result).toBe(3); // 2 from first test + 1 from specific select test
  });

  test('should group by field and aggregate', async () => {
    const groups = await bookRepo.group({ 
      by: ['author'], 
      aggregate: { id: 'count' } 
    });
    expect(groups.length).toBe(2); // Two different authors
    const specificAuthorGroup = groups.find((g: any) => g.count_id == 1);
    expect(specificAuthorGroup).toBeDefined();
  });
});
