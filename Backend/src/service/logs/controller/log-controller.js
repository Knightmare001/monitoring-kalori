import logRepository from "../repositories/log-repositories.js";
import foodRepository from "../../foods/repositories/food-repositories.js";
import response from "../../../utils/response.js";
import { NotFoundError, InvariantError } from "../../../exceptions/index.js";
import mongoose from "mongoose";

// POST /api/logs  → Catat makanan yang dikonsumsi
export const createLog = async (req, res, next) => {
  try {
    //req.validated sekarang berbentuk ARRAY of OBJECTS
    const items = req.validated;

    if (!Array.isArray(items) || items.length === 0) {
      throw new InvariantError("Data makanan tidak boleh kosong.");
    }

    const preparedLogs = [];
    const responseConsumedItems = [];

    //Loop setiap makanan yang diinput
    for (const item of items) {
      const { foodId, serving } = item;

      if (!mongoose.Types.ObjectId.isValid(foodId)) {
        throw new InvariantError(`foodId ${foodId} tidak valid.`);
      }

      const food = await foodRepository.findById(foodId);
      if (!food) {
        throw new NotFoundError(`Makanan dengan ID ${foodId} tidak ditemukan.`);
      }

      // Hitung porsi pecahan (Gram input / Serving Size basis)
      const portionMultiplier = serving / food.servingSize;

      // Buat snapshot gizi
      const snapshot = {
        name: food.name,
        calories: food.calories,
        carbs: food.carbs,
        protein: food.protein,
        fat: food.fat,
      };

      // Bungkus data untuk disimpan ke MongoDB bulk
      preparedLogs.push({
        userId: req.user.id,
        foodId,
        serving: portionMultiplier, // Simpan porsi pecahan di DB
        snapshot,
      });

      // Data untuk respon balik ke frontend (menampilkan gram asli)
      responseConsumedItems.push({
        // logId: log._id,
        food: food.name,
        servingInGram: serving,
        consumed: {
          calories: Math.round(food.calories * portionMultiplier * 10) / 10,
          carbs: Math.round(food.carbs * portionMultiplier * 10) / 10,
          protein: Math.round(food.protein * portionMultiplier * 10) / 10,
          fat: Math.round(food.fat * portionMultiplier * 10) / 10,
        },
      });
    }

    // 3. Kirim kumpulan data ke repository untuk insert banyak sekaligus
    const insertedLogs = await logRepository.createManyLogs(preparedLogs);

    return response(res, 201, "Semua log makanan berhasil dicatat", {
      totalItemsInserted: insertedLogs.length,
      details: responseConsumedItems,
    });
  } catch (err) {
    next(err);
  }
};
// DELETE /api/logs/:id  → Hapus log
export const deleteLog = async (req, res, next) => {
  try {
    const deleted = await logRepository.deleteLog(req.params.id, req.user.id);
    if (!deleted) throw new NotFoundError("Log tidak ditemukan atau bukan milik Anda.");
    return response(res, 200, "Log berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

// GET /api/logs/today  → Ringkasan konsumsi hari ini
export const getTodayLog = async (req, res, next) => {
  try {
    const result = await logRepository.getTodaySummary(new mongoose.Types.ObjectId(req.user.id));
    return response(res, 200, "Log hari ini berhasil diambil", result);
  } catch (err) {
    next(err);
  }
};
