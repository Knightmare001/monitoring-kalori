import { ActivityType, ActivityLog } from "../../../models/Activity.js";

class ActivityRepository {
  // Daftar jenis olahraga
  async getActivityTypes({ search, category }) {
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    return await ActivityType.find(filter).sort({ name: 1 });
  }

  async findActivityTypeById(id) {
    return await ActivityType.findById(id);
  }

  // Log olahraga
  async createActivityLog({ userId, activityTypeId, durationMinutes, caloriesBurned, snapshot }) {
    const log = new ActivityLog({ userId, activityTypeId, durationMinutes, caloriesBurned, snapshot });
    await log.save();
    return log;
  }

  async getTodayActivityLogs(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await ActivityLog.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("activityTypeId", "name category")
      .sort({ date: -1 });

    const totalCaloriesBurned = logs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0);
    return { logs, totalCaloriesBurned: Math.round(totalCaloriesBurned) };
  }

  async deleteActivityLog(logId, userId) {
    return await ActivityLog.findOneAndDelete({ _id: logId, userId });
  }
}

export default new ActivityRepository();
