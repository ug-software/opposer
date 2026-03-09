import { OpposerDatabase } from '../../../orm';
export default class CatalogRefreshSchedules {
    refreshCatalog(): Promise<{
        status: string;
        imported: number;
        timestamp: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
        imported?: undefined;
        timestamp?: undefined;
    }>;
    /**
     * Logic to wipe and refill the catalog with 10,000 books
     */
    static performRefresh(db: OpposerDatabase): Promise<{
        status: string;
        imported: number;
        timestamp: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
        imported?: undefined;
        timestamp?: undefined;
    }>;
}
