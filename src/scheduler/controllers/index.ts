import { Controller, Method } from '../../server/decorators/index.js';
import { Success } from '../../server/helpers/index.js';
import scheduler from '../index.js';
import ScheduleHistory from '../models/history.js';
import { OpposerDatabase } from '../../orm/index.js';
import { PayloadRequest } from '../../interfaces/controller.js';
import { Context } from '../../server/index.js';

@Controller('scheduler')
export default class SchedulerController {
  private get db() {
    return Context.get<OpposerDatabase>('db');
  }

  @Method()
  async listTasks() {
    return Success(scheduler.getTasks());
  }

  @Method()
  async getHistory() {
    const historyRepo = this.db.getRepository(ScheduleHistory);
    const history = await historyRepo.find({
      pagination: { page: 0, take: 50 }, // Last 50 runs
    });

    const sortedHistory = history.sort((a: any, b: any) => new Date(b.st).getTime() - new Date(a.st).getTime());

    return Success(sortedHistory);
  }

  @Method()
  async runTask(payload: PayloadRequest<{ name: string; data?: any }>) {
    const { name, data } = payload.data;
    const result = await scheduler.runTask(name, data);
    return Success(result);
  }
}
