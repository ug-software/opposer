import { Schedule } from "../../../scheduler/index.js";
import { Context } from "../../../server/index.js";
import { OpposerDatabase } from "../../../orm/index.js";
import Book from "../models/book.js";

export default class InventorySchedules {
  @Schedule({
    name: "library-inventory-check",
    interval: 300000, // 5 minutes
  })
  async checkStock() {
    // Using the new global Context to get the database
    const db = Context.get<OpposerDatabase>("db");
    const bookRepo = db.getRepository(Book);
    
    const count = await bookRepo.count({});
    console.log(`[schedule] Inventory check: ${count} books in library.`);
    
    return { 
      timestamp: new Date().toISOString(),
      booksChecked: count,
      status: "Inventory levels are stable"
    };
  }

  @Schedule({
    name: "import-external-catalog",
    interval: 3600000, // 1 hour
    enabled: false
  })
  async importCatalog() {
    console.log(`[schedule] Importing new titles from external partners...`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      imported: 12,
      skipped: 2,
      errors: 0
    };
  }
}
