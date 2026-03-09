export default class InventorySchedules {
    checkStock(): Promise<{
        timestamp: string;
        booksChecked: number;
        status: string;
    }>;
    importCatalog(): Promise<{
        imported: number;
        skipped: number;
        errors: number;
    }>;
}
