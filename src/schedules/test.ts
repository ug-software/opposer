import { Schedule } from "../scheduler/decorators/index.js";

export default class TestSchedule {
  @Schedule({
    name: "heartbeat",
    interval: 10000, // 10 seconds
  })
  async heartbeat() {
    console.log(`[schedule] Heartbeat at ${new Date().toISOString()}`);
    return { status: "alive" };
  }

  @Schedule({
    name: "daily-report",
    interval: 86400000, // 24 hours
    enabled: false
  })
  async dailyReport(data?: any) {
    console.log(`[schedule] Generating daily report...`, data);
    // Simulate long task
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[schedule] Report sent.`);
    return { pdf: "report.pdf", sent: true };
  }
}
