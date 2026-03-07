import { PayloadRequest } from "../../interfaces/handler.js";
export default class SchedulerHandler {
    private get db();
    listTasks(): Promise<{
        readonly success: true;
        readonly data: any;
    }>;
    getHistory(): Promise<{
        readonly success: true;
        readonly data: any;
    }>;
    runTask(payload: PayloadRequest<{
        name: string;
        data?: any;
    }>): Promise<{
        readonly success: true;
        readonly data: any;
    }>;
}
