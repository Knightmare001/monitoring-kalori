import response from "../../../utils/response.js";
import userRepository from "../../users/repositories/user-repositories.js";
import logRepository from "../../logs/repositories/log-repositories.js";
import activityRepository from "../../activities/repositories/activity-repositories.js";
import { calculateMifflin } from "../../calculator/controller/calculator-controller.js";
import mongoose from "mongoose";

const ACTIVITY_FACTOR = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// GET /api/dashboard/summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const objectId = new mongoose.Types.ObjectId(userId);

    // Ambil profil user, log makanan hari ini, dan log olahraga hari ini secara paralel
    const [user, todayFoodData, todayActivityData] = await Promise.all([
      userRepository.findById(userId),
      logRepository.getTodaySummary(objectId),
      activityRepository.getTodayActivityLogs(userId),
    ]);

    // Hitung TDEE jika profil lengkap
    let tdee = null;
    let bmr = null;
    let macroTargets = null;
    const profileComplete = user.age && user.gender && user.height && user.weight;

    if (profileComplete) {
      bmr = Math.round(
        calculateMifflin({ weight: user.weight, height: user.height, age: user.age, gender: user.gender }),
      );
      const factor = ACTIVITY_FACTOR[user.activityLevel || "sedentary"];
      tdee = Math.round(bmr * factor);

      macroTargets = {
        calories: tdee,
        carbs: Math.round((tdee * 0.5) / 4),
        protein: Math.round((tdee * 0.2) / 4),
        fat: Math.round((tdee * 0.3) / 9),
      };
    }

    const consumed = todayFoodData.totals;

    // Kalori yang terbakar dari olahraga hari ini
    const caloriesBurned = todayActivityData.totalCaloriesBurned || 0;

    /**
     * Logika: Olahraga mengurangi kalori bersih yang dianggap sudah dikonsumsi.
     * Target (TDEE) tetap utuh, tidak berubah.
     * Konsumsi bersih = kalori makanan - kalori terbakar olahraga (minimal 0)
     * Remaining = TDEE - konsumsi bersih
     *
     * Hanya kalori yang dipengaruhi olahraga.
     * Makro (karbo/protein/lemak) tetap dihitung dari target TDEE dasar.
     */
    const netCaloriesConsumed = Math.max(consumed.calories - caloriesBurned, 0);

    const remaining = macroTargets
      ? {
          calories: Math.round((macroTargets.calories - netCaloriesConsumed) * 10) / 10,
          carbs: Math.round((macroTargets.carbs - consumed.carbs) * 10) / 10,
          protein: Math.round((macroTargets.protein - consumed.protein) * 10) / 10,
          fat: Math.round((macroTargets.fat - consumed.fat) * 10) / 10,
        }
      : null;

    return response(res, 200, "Data dasbor berhasil diambil", {
      user: {
        name: user.name,
        profileComplete,
      },
      bmr,
      tdee,
      macroTargets,
      consumed,
      caloriesBurned, // total kalori terbakar olahraga hari ini
      effectiveCalorieTarget: macroTargets
        ? macroTargets.calories // target kalori efektif (TDEE)
        : null,
      remaining,
      todayLogs: todayFoodData.logs,
      todayActivityLogs: todayActivityData.logs,
    });
  } catch (err) {
    next(err);
  }
};
