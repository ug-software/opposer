export default class TestSchedule {
    heartbeat(): Promise<{
        status: string;
    }>;
    dailyReport(data?: any): Promise<{
        pdf: string;
        sent: boolean;
    }>;
}
