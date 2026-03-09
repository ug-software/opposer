export default class LibraryAlertSchedules {
    checkOverdue(): Promise<{
        overdueCount: number;
        notificationsSent: boolean;
    }>;
    generateSalesReport(): Promise<{
        reportId: string;
        status: string;
        path: string;
    }>;
}
