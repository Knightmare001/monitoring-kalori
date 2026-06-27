import response from "../../../utils/response.js";
import userRepository from "../../users/repositories/user-repositories.js";

/**
 * Algoritma Mifflin-St Jeor untuk menghitung BMR:
 *   Laki-laki:  BMR = (10 × berat_kg) + (6.25 × tinggi_cm) − (5 × usia) + 5
 *   Perempuan:  BMR = (10 × berat_kg) + (6.25 × tinggi_cm) − (5 × usia) − 161
 */
const ACTIVITY_MULTIPLIER = {
  sedentary:  { factor: 1.2,   label: "Tidak aktif (jarang atau tidak berolahraga)" },
  light:      { factor: 1.375, label: "Ringan (olahraga 1–3 hari/minggu)" },
  moderate:   { factor: 1.55,  label: "Sedang (olahraga 3–5 hari/minggu)" },
  active:     { factor: 1.725, label: "Aktif (olahraga berat 6–7 hari/minggu)" },
  very_active:{ factor: 1.9,   label: "Sangat aktif (olahraga intensitas tinggi & kerja fisik)" },
};

export const calculateMifflin = ({ weight, height, age, gender }) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "Laki-laki" ? base + 5 : base - 161;
};

// POST /api/calculator  → Hitung BMR & TDEE dari body request
export const calculate = async (req, res, next) => {
  try {
    const { age, gender, height, weight, activityLevel } = req.validated;

    const bmr = calculateMifflin({ weight, height, age, gender });
    const { factor, label } = ACTIVITY_MULTIPLIER[activityLevel];
    const tdee = Math.round(bmr * factor);

    // Distribusi makro standar: 50% karbo, 20% protein, 30% lemak
    const macros = {
      carbs:   Math.round((tdee * 0.5) / 4),  // 1 gram karbo = 4 kkal
      protein: Math.round((tdee * 0.2) / 4),  // 1 gram protein = 4 kkal
      fat:     Math.round((tdee * 0.3) / 9),  // 1 gram lemak = 9 kkal
    };

    return response(res, 200, "Kalkulasi berhasil", {
      inputs: { age, gender, height, weight, activityLevel },
      bmr: Math.round(bmr),
      tdee,
      activityLabel: label,
      recommendedMacros: macros,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/calculator/my  → Hitung dari profil user yang sedang login
export const calculateFromProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);

    const { age, gender, height, weight, activityLevel } = user;
    if (!age || !gender || !height || !weight) {
      return response(
        res,
        422,
        "Profil belum lengkap. Harap isi usia, jenis kelamin, tinggi, dan berat badan terlebih dahulu.",
        null
      );
    }

    const bmr = calculateMifflin({ weight, height, age, gender });
    const level = activityLevel || "sedentary";
    const { factor, label } = ACTIVITY_MULTIPLIER[level];
    const tdee = Math.round(bmr * factor);

    const macros = {
      carbs:   Math.round((tdee * 0.5) / 4),
      protein: Math.round((tdee * 0.2) / 4),
      fat:     Math.round((tdee * 0.3) / 9),
    };

    return response(res, 200, "Kalkulasi dari profil berhasil", {
      profile: { name: user.name, age, gender, height, weight, activityLevel: level },
      bmr: Math.round(bmr),
      tdee,
      activityLabel: label,
      recommendedMacros: macros,
    });
  } catch (err) {
    next(err);
  }
};
