import activityRepository from "../repositories/activity-repositories.js";
import userRepository from "../../users/repositories/user-repositories.js";
import response from "../../../utils/response.js";
import { NotFoundError, InvariantError } from "../../../exceptions/index.js";
import mongoose from "mongoose";

// GET /api/activities/types?search=lari
export const getActivityTypes = async (req, res, next) => {
  try {
    const { search = "", category = "" } = req.query;
    const types = await activityRepository.getActivityTypes({ search, category });
    return response(res, 200, "Daftar jenis olahraga berhasil diambil", types);
  } catch (err) {
    next(err);
  }
};

// POST /api/activities/logs  → Catat log olahraga
export const createActivityLog = async (req, res, next) => {
  try {
    const { activityTypeId, durationMinutes } = req.validated;

    if (!mongoose.Types.ObjectId.isValid(activityTypeId)) {
      throw new InvariantError("activityTypeId tidak valid.");
    }

    const activityType = await activityRepository.findActivityTypeById(activityTypeId);
    if (!activityType) throw new NotFoundError("Jenis olahraga tidak ditemukan.");

    // Hitung kalori terbakar menggunakan rumus MET:
    // Kalori = MET × berat_kg × (durasi_menit / 60)
    const user = await userRepository.findById(req.user.id);
    const weightKg = user.weight || 70; // default 70 kg jika belum diisi
    const caloriesBurned =
      Math.round(activityType.metValue * weightKg * (durationMinutes / 60) * 10) / 10;

    const log = await activityRepository.createActivityLog({
      userId: req.user.id,
      activityTypeId,
      durationMinutes,
      caloriesBurned,
      snapshot: { name: activityType.name, metValue: activityType.metValue },
    });

    return response(res, 201, "Log olahraga berhasil dicatat", {
      logId: log._id,
      activity: activityType.name,
      durationMinutes,
      caloriesBurned,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/activities/logs/today  → Log olahraga hari ini
export const getTodayActivityLogs = async (req, res, next) => {
  try {
    const result = await activityRepository.getTodayActivityLogs(req.user.id);
    return response(res, 200, "Log olahraga hari ini berhasil diambil", result);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/activities/logs/:id  → Hapus log olahraga
export const deleteActivityLog = async (req, res, next) => {
  try {
    const deleted = await activityRepository.deleteActivityLog(req.params.id, req.user.id);
    if (!deleted) throw new NotFoundError("Log olahraga tidak ditemukan atau bukan milik Anda.");
    return response(res, 200, "Log olahraga berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};
