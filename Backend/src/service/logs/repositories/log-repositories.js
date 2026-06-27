import DailyLog from "../../../models/DailyLog.js";

class LogRepository {
  async createLog({ userId, foodId, serving, snapshot }) {
    const log = new DailyLog({ userId, foodId, serving, snapshot });
    await log.save();
    return log;
  }

  async createManyLogs(logsArray) {
    // logsArray berisi array objek yang sudah rapi dikalkulasi dari controller
    return await DailyLog.insertMany(logsArray);
  }

  async deleteLog(logId, userId) {
    // Pastikan log hanya bisa dihapus oleh pemiliknya
    return await DailyLog.findOneAndDelete({ _id: logId, userId });
  }

  // Ambil semua log hari ini untuk user tertentu beserta total akumulasinya
  async getTodaySummary(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil daftar log hari ini
    const logs = await DailyLog.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("foodId", "name category")
      .sort({ date: -1 });

    // Hitung total menggunakan aggregation
    const [totals] = await DailyLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: { $multiply: ["$snapshot.calories", "$serving"] } },
          totalCarbs: { $sum: { $multiply: ["$snapshot.carbs", "$serving"] } },
          totalProtein: { $sum: { $multiply: ["$snapshot.protein", "$serving"] } },
          totalFat: { $sum: { $multiply: ["$snapshot.fat", "$serving"] } },
        },
      },
    ]);

    return {
      logs,
      totals: totals
        ? {
            calories: Math.round(totals.totalCalories * 10) / 10,
            carbs: Math.round(totals.totalCarbs * 10) / 10,
            protein: Math.round(totals.totalProtein * 10) / 10,
            fat: Math.round(totals.totalFat * 10) / 10,
          }
        : { calories: 0, carbs: 0, protein: 0, fat: 0 },
    };
  }
}

export default new LogRepository();
