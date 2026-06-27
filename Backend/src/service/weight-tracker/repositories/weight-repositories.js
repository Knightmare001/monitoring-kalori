import WeightTracker from "../../../models/WeightTracker.js";

class WeightTrackerRepository {
  async create({ userId, weight, note, recordedAt }) {
    const record = new WeightTracker({ userId, weight, note, recordedAt });
    await record.save();
    return record;
  }

  async getHistory(userId, limit = 30) {
    return await WeightTracker.find({ userId })
      .sort({ recordedAt: -1 })
      .limit(limit);
  }

  async deleteRecord(recordId, userId) {
    return await WeightTracker.findOneAndDelete({ _id: recordId, userId });
  }
}

export default new WeightTrackerRepository();
