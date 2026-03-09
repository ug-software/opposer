import { Schedule } from '../../../scheduler';
import { Context } from '../../../server';
import { OpposerDatabase } from '../../../orm';
import Book from '../models/book.js';
import Author from '../models/author.js';
import Category from '../models/category.js';
import { randomUUID } from 'crypto';

export default class CatalogRefreshSchedules {
  @Schedule({
    name: 'hourly-catalog-wipe-and-refill',
    interval: 3600000, // 1 hour
  })
  async refreshCatalog() {
    console.log('[schedule] Starting hourly catalog refresh...');
    const db = Context.get<OpposerDatabase>('db');
    return await CatalogRefreshSchedules.performRefresh(db);
  }

  /**
   * Logic to wipe and refill the catalog with 10,000 books
   */
  static async performRefresh(db: OpposerDatabase) {
    try {
      const authorRepo = db.getRepository(Author);
      const categoryRepo = db.getRepository(Category);
      const bookRepo = db.getRepository(Book);

      const totalToFetch = 100;
      const pageSize = 10;
      const pages = totalToFetch / pageSize;

      console.log(`[catalog-refresh] Fetching ${totalToFetch} books from Open Library...`);

      const allBooksData: any[] = [];

      for (let i = 0; i < pages; i += 5) {
        const requests = [];
        for (let j = 0; j < 5 && i + j < pages; j++) {
          const page = i + j + 1;
          requests.push(
            fetch(`https://openlibrary.org/search.json?q=has_fulltext:true&page=${page}&limit=${pageSize}`)
              .then((res) => res.json())
              .then((data: any) => data.docs || [])
              .catch((err) => {
                console.error(`Error fetching page ${page}:`, err.message);
                return [];
              }),
          );
        }
        const results = await Promise.all(requests);
        allBooksData.push(...results.flat());

        if (allBooksData.length >= totalToFetch) break;
      }

      console.log('allBooksData', allBooksData);

      if (allBooksData.length === 0) throw new Error('No books fetched from API');

      console.log(`[catalog-refresh] Wiping current database...`);
      //@ts-ignore
      if (typeof db.query === 'function') {
        //@ts-ignore
        await db.query('DELETE FROM books');
        //@ts-ignore
        await db.query('DELETE FROM authors');
        //@ts-ignore
        await db.query('DELETE FROM categories');
      } else {
        //@ts-ignore
        if (typeof bookRepo.delete === 'function') {
          //@ts-ignore
          await bookRepo.delete({});
          //@ts-ignore
          await authorRepo.delete({});
          //@ts-ignore
          await categoryRepo.delete({});
        }
      }

      const authorsMap = new Map<string, string>();
      const categoriesMap = new Map<string, string>();
      let importedCount = 0;

      console.log(`[catalog-refresh] Processing and inserting records...`);

      for (const bookData of allBooksData) {
        if (!bookData.title) continue;

        // Author
        const authorName = (bookData.author_name && bookData.author_name[0]) || 'Unknown Author';
        let authorId = authorsMap.get(authorName);
        if (!authorId) {
          authorId = randomUUID();
          await authorRepo.insert({
            id: authorId,
            name: authorName,
            nationality: 'Unknown',
          });
          authorsMap.set(authorName, authorId);
        }

        // Category
        const categoryName = (bookData.subject && bookData.subject[0]) || 'General';
        let categoryId = categoriesMap.get(categoryName);
        if (!categoryId) {
          categoryId = randomUUID();
          await categoryRepo.insert({
            id: categoryId,
            title: categoryName,
          });
          categoriesMap.set(categoryName, categoryId);
        }

        // Book
        let imageUrl = bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg` : undefined;
        await bookRepo.insert({
          id: randomUUID(),
          title: bookData.title,
          price: Math.floor(Math.random() * 100) + 20,
          imageUrl,
          author: authorId as any,
          category: categoryId as any,
        } as any);

        importedCount++;
        if (importedCount % 1000 === 0) console.log(`[catalog-refresh] Imported ${importedCount} books...`);
        if (importedCount >= totalToFetch) break;
      }

      console.log(`[catalog-refresh] Success! Total imported: ${importedCount}`);
      return {
        status: 'success',
        imported: importedCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`[catalog-refresh] Failed:`, error.message);
      return { status: 'error', message: error.message };
    }
  }
}
