import weightRepository from "../repositories/weight-repositories.js";
import response from "../../../utils/response.js";
import { NotFoundError } from "../../../exceptions/index.js";

// POST /api/weight-tracker  → Catat berat badan
export const createWeightRecord = async (req, res, next) => {
  try {
    const { weight, note, recordedAt } = req.validated;

    const record = await weightRepository.create({
      userId: req.user.id,
      weight,
      note,
      recordedAt,
    });

    return response(res, 201, "Berat badan berhasil dicatat", record);
  } catch (err) {
    next(err);
  }
};

// GET /api/weight-tracker  → Riwayat berat badan (untuk grafik progres)
export const getWeightHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const records = await weightRepository.getHistory(req.user.id, limit);

    // Kirim dari yang terlama ke terbaru agar grafik urut secara kronologis
    const sortedForChart = [...records].reverse();

    return response(res, 200, "Riwayat berat badan berhasil diambil", {
      records: sortedForChart,
      count: records.length,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/weight-tracker/:id  → Hapus catatan
export const deleteWeightRecord = async (req, res, next) => {
  try {
    const deleted = await weightRepository.deleteRecord(req.params.id, req.user.id);
    if (!deleted) throw new NotFoundError("Catatan tidak ditemukan atau bukan milik Anda.");
    return response(res, 200, "Catatan berat badan berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};
