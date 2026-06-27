/**
 * Seeder: Mengisi database dengan data awal makanan Indonesia & jenis olahraga
 * Jalankan dengan: node src/seeders/seed.js
 *
 * SUMBER DATA MAKANAN:
 * Kementerian Kesehatan RI. (2018). Tabel Komposisi Pangan Indonesia 2017.
 * Direktorat Gizi Masyarakat, Direktorat Jenderal Kesehatan Masyarakat.
 * ISBN 978-602-416-407-2.
 *
 * Setiap item mencantumkan kode TKPI aslinya (field `tkpiCode`) dan nama
 * baku TKPI (field `tkpiName`) sebagai jejak audit/transparansi data,
 * sesuai nilai energi, protein, lemak, dan karbohidrat per 100 gram BDD
 * (Berat Dapat Dimakan). Beberapa nilai juga disilangkan dengan
 * nilaigizi.com (portal yang menampilkan data TKPI per-item) untuk
 * verifikasi ganda.
 *
 * CATATAN: Beberapa makanan populer (mis. Nasi Goreng versi rumahan,
 * Bakso, Teh Manis, Kopi Susu) TIDAK terdaftar di TKPI sebagai item
 * tunggal karena merupakan hidangan komposit/non-standar. Item tersebut
 * diganti dengan bahan pangan terdekat yang memang tercatat resmi di
 * TKPI (lihat README_DATA_MAKANAN.md untuk daftar penggantian lengkap).
 *
 * SUMBER DATA OLAHRAGA (nilai MET):
 * Ainsworth, B.E., et al. (2011). 2011 Compendium of Physical Activities:
 * A Second Update of Codes and MET Values. Medicine & Science in Sports
 * & Exercise, 43(8), 1575-1581.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/Food.js";
import { ActivityType } from "../models/Activity.js";

dotenv.config();

const foods = [
  // ===== SEREALIA, UMBI & OLAHANNYA =====
  {
    name: "Nasi Putih",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 180,
    carbs: 39.8,
    protein: 3.0,
    fat: 0.3,
    tkpiCode: "AP001",
    tkpiName: "Nasi",
  },
  {
    name: "Nasi Merah",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 149,
    carbs: 32.5,
    protein: 2.8,
    fat: 0.4,
    tkpiCode: "AR005",
    tkpiName: "Beras merah, Nasi",
  },
  {
    name: "Roti Putih",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 248,
    carbs: 50.0,
    protein: 8.0,
    fat: 1.2,
    tkpiCode: "AP024",
    tkpiName: "Roti putih",
  },
  {
    name: "Bihun Goreng Instan",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 381,
    carbs: 80.3,
    protein: 6.1,
    fat: 3.9,
    tkpiCode: "AP007",
    tkpiName: "Bihun goreng instan",
  },
  {
    name: "Kentang Segar",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 62,
    carbs: 13.5,
    protein: 2.1,
    fat: 0.2,
    tkpiCode: "BR013",
    tkpiName: "Kentang, segar",
  },
  {
    name: "Ubi Jalar Manis Segar",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 83,
    carbs: 18.8,
    protein: 1.5,
    fat: 0.2,
    tkpiCode: "BR029",
    tkpiName: "Ubi jalar manis, segar",
  },
  {
    name: "Tepung Terigu",
    category: "Nasi & Umbi",
    servingSize: 100,
    servingUnit: "gram",
    calories: 333,
    carbs: 77.2,
    protein: 9.0,
    fat: 1.0,
    tkpiCode: "AP025",
    tkpiName: "Tepung terigu",
  },

  // ===== LAUK PAUK (DAGING, AYAM, IKAN, TELUR, KACANG-KACANGAN) =====
  {
    name: "Ayam Goreng Kentucky, Dada",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 298,
    carbs: 0.1,
    protein: 34.2,
    fat: 16.8,
    tkpiCode: "FP025",
    tkpiName: "Ayam goreng kentucky, dada",
  },
  {
    name: "Ayam Goreng Kentucky, Paha",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 286,
    carbs: 1.1,
    protein: 32.1,
    fat: 16.1,
    tkpiCode: "FP026",
    tkpiName: "Ayam goreng kentucky, paha",
  },
  {
    name: "Ayam Goreng Kalasan, Paha",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 275,
    carbs: 1.3,
    protein: 37.4,
    fat: 12.2,
    tkpiCode: "FP024",
    tkpiName: "Ayam goreng kalasan, paha",
  },
  {
    name: "Daging Ayam Segar",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 298,
    carbs: 0.0,
    protein: 18.2,
    fat: 25.0,
    tkpiCode: "FR005",
    tkpiName: "Ayam, daging, segar",
  },
  {
    name: "Ikan Mujahir Goreng",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 416,
    carbs: 0.0,
    protein: 46.9,
    fat: 23.9,
    tkpiCode: "GP020",
    tkpiName: "Ikan mujahir goreng",
  },
  {
    name: "Ikan Tongkol Segar",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 100,
    carbs: 8.0,
    protein: 13.7,
    fat: 1.5,
    tkpiCode: "GR070",
    tkpiName: "Ikan tongkol, segar",
  },
  {
    name: "Telur Ayam Ras Segar",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 154,
    carbs: 0.7,
    protein: 12.4,
    fat: 10.8,
    tkpiCode: "HR002",
    tkpiName: "Telur ayam ras, segar",
  },
  {
    name: "Telur Ayam Dadar/Goreng",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 251,
    carbs: 1.4,
    protein: 16.3,
    fat: 19.4,
    tkpiCode: "HP001",
    tkpiName: "Telur ayam, dadar, masakan",
  },
  {
    name: "Tempe Kedelai Goreng",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 350,
    carbs: 10.4,
    protein: 24.5,
    fat: 26.6,
    tkpiCode: "CP076",
    tkpiName: "Tempe kedelai murni, goreng",
  },
  {
    name: "Tahu Mentah",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 80,
    carbs: 0.8,
    protein: 10.9,
    fat: 4.7,
    tkpiCode: "CP061",
    tkpiName: "Tahu, mentah",
  },
  {
    name: "Tahu Goreng",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 115,
    carbs: 2.5,
    protein: 9.7,
    fat: 8.5,
    tkpiCode: "CP062",
    tkpiName: "Tahu goreng",
  },
  {
    name: "Rendang Sapi",
    category: "Lauk Pauk",
    servingSize: 100,
    servingUnit: "gram",
    calories: 193,
    carbs: 7.8,
    protein: 22.6,
    fat: 7.9,
    tkpiCode: "FP062",
    tkpiName: "Rendang sapi, masakan",
  },

  // ===== SAYURAN =====
  {
    name: "Bayam Segar",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 16,
    carbs: 2.9,
    protein: 0.9,
    fat: 0.4,
    tkpiCode: "DR008",
    tkpiName: "Bayam, segar",
  },
  {
    name: "Bayam Rebus",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 23,
    carbs: 3.7,
    protein: 1.2,
    fat: 0.6,
    tkpiCode: "DP002",
    tkpiName: "Bayam, rebus",
  },
  {
    name: "Kangkung Segar",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 28,
    carbs: 3.9,
    protein: 3.4,
    fat: 0.7,
    tkpiCode: "DR100",
    tkpiName: "Kangkung, segar",
  },
  {
    name: "Kangkung Rebus",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 22,
    carbs: 3.1,
    protein: 2.5,
    fat: 0.6,
    tkpiCode: "DP014",
    tkpiName: "Kangkung, rebus",
  },
  {
    name: "Wortel Segar",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 36,
    carbs: 7.9,
    protein: 1.0,
    fat: 0.6,
    tkpiCode: "DR166",
    tkpiName: "Wortel, segar",
  },
  {
    name: "Wortel Rebus",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 28,
    carbs: 6.3,
    protein: 0.7,
    fat: 0.5,
    tkpiCode: "DP020",
    tkpiName: "Wortel, rebus",
  },
  {
    name: "Kacang Panjang Segar",
    category: "Sayuran",
    servingSize: 100,
    servingUnit: "gram",
    calories: 31,
    carbs: 5.3,
    protein: 2.3,
    fat: 0.1,
    tkpiCode: "DR097",
    tkpiName: "Kacang panjang, segar",
  },

  // ===== BUAH =====
  {
    name: "Pisang Ambon",
    category: "Buah",
    servingSize: 100,
    servingUnit: "gram",
    calories: 108,
    carbs: 24.3,
    protein: 1.0,
    fat: 0.8,
    tkpiCode: "ER074",
    tkpiName: "Pisang ambon, segar",
  },
  {
    name: "Apel Segar",
    category: "Buah",
    servingSize: 100,
    servingUnit: "gram",
    calories: 58,
    carbs: 14.9,
    protein: 0.3,
    fat: 0.4,
    tkpiCode: "ER004",
    tkpiName: "Apel, segar",
  },
  {
    name: "Mangga Segar",
    category: "Buah",
    servingSize: 100,
    servingUnit: "gram",
    calories: 52,
    carbs: 12.3,
    protein: 0.7,
    fat: 0.0,
    tkpiCode: "ER054",
    tkpiName: "Mangga, segar",
  },
  {
    name: "Pepaya Segar",
    category: "Buah",
    servingSize: 100,
    servingUnit: "gram",
    calories: 46,
    carbs: 12.2,
    protein: 0.5,
    fat: 0.1,
    tkpiCode: "ER073",
    tkpiName: "Pepaya, segar",
  },
  {
    name: "Semangka Segar",
    category: "Buah",
    servingSize: 100,
    servingUnit: "gram",
    calories: 28,
    carbs: 6.9,
    protein: 0.5,
    fat: 0.2,
    tkpiCode: "ER105",
    tkpiName: "Semangka, segar",
  },

  // ===== MINUMAN & LAINNYA =====
  {
    name: "Susu Sapi Segar",
    category: "Minuman",
    servingSize: 100,
    servingUnit: "ml",
    calories: 61,
    carbs: 4.3,
    protein: 3.2,
    fat: 3.5,
    tkpiCode: "JR006",
    tkpiName: "Susu sapi, segar",
  },
  {
    name: "Bakwan Goreng",
    category: "Snack",
    servingSize: 100,
    servingUnit: "gram",
    calories: 280,
    carbs: 39.0,
    protein: 8.2,
    fat: 10.2,
    tkpiCode: "AP031",
    tkpiName: "Bakwan",
  },
  {
    name: "Kerupuk Kemplang Goreng",
    category: "Snack",
    servingSize: 100,
    servingUnit: "gram",
    calories: 504,
    carbs: 57.1,
    protein: 5.6,
    fat: 28.1,
    tkpiCode: "BP042",
    tkpiName: "Kerupuk kemplang, goreng",
  },
];

/**
 * Nilai MET (Metabolic Equivalent of Task) bersumber dari:
 * Ainsworth, B.E., Haskell, W.L., Herrmann, S.D., Willis, E.A., et al. (2024).
 * 2024 Adult Compendium of Physical Activities. https://pacompendium.com
 *
 * Setiap item mencantumkan `metCode` (5-digit activity code resmi) dan
 * `metSourceDescription` (deskripsi asli dalam bahasa Inggris dari dokumen)
 * sebagai jejak audit. caloriesPerHour dihitung dengan formula resmi MET:
 *   kalori/jam = MET x berat_kg x 1 jam
 * menggunakan asumsi berat badan referensi 70 kg (caloriesPerHour = MET x 70).
 */
const activityTypes = [
  {
    name: "Berjalan Kaki (Santai)",
    category: "Kardio",
    metValue: 3.5,
    caloriesPerHour: 245,
    metCode: "17160",
    metSourceDescription: "Walking for pleasure",
  },
  {
    name: "Berjalan Kaki (Cepat)",
    category: "Kardio",
    metValue: 4.8,
    caloriesPerHour: 336,
    metCode: "17200",
    metSourceDescription: "Walking, 3.5 to 3.9 mph, level, brisk, firm surface, walking for exercise",
  },
  {
    name: "Berlari (Jogging)",
    category: "Kardio",
    metValue: 7.5,
    caloriesPerHour: 525,
    metCode: "12020",
    metSourceDescription: "Jogging, general, self-selected pace",
  },
  {
    name: "Berlari (Cepat)",
    category: "Kardio",
    metValue: 11.0,
    caloriesPerHour: 770,
    metCode: "12070",
    metSourceDescription: "Running, 7 mph (8.5 min/mile)",
  },
  {
    name: "Bersepeda (Santai)",
    category: "Kardio",
    metValue: 4.0,
    caloriesPerHour: 280,
    metCode: "01010",
    metSourceDescription: "Bicycling, <10 mph, leisure, to work or for pleasure",
  },
  {
    name: "Bersepeda (Sedang)",
    category: "Kardio",
    metValue: 8.0,
    caloriesPerHour: 560,
    metCode: "01030",
    metSourceDescription: "Bicycling, 12-13.9 mph, leisure, moderate effort",
  },
  {
    name: "Renang (Gaya Bebas Sedang)",
    category: "Kardio",
    metValue: 5.8,
    caloriesPerHour: 406,
    metCode: "18240",
    metSourceDescription: "Swimming laps, freestyle, slow, recreational",
  },
  {
    name: "Senam Aerobik",
    category: "Kardio",
    metValue: 7.3,
    caloriesPerHour: 511,
    metCode: "02000",
    metSourceDescription: "Aerobic, general",
  },
  {
    name: "Zumba",
    category: "Kardio",
    metValue: 6.5,
    caloriesPerHour: 455,
    metCode: "02310",
    metSourceDescription: "Zumba, group class",
  },
  {
    name: "Lompat Tali",
    category: "Kardio",
    metValue: 11.8,
    caloriesPerHour: 826,
    metCode: "15551",
    metSourceDescription: "Rope jumping, moderate pace, general, 100 to 120 skips/min",
  },
  {
    name: "Push Up",
    category: "Kekuatan",
    metValue: 3.8,
    caloriesPerHour: 266,
    metCode: "02022",
    metSourceDescription: "Calisthenics (e.g., pushups, sit ups, pull-ups, lunges), moderate effort",
  },
  {
    name: "Sit Up / Crunch",
    category: "Kekuatan",
    metValue: 2.8,
    caloriesPerHour: 196,
    metCode: "02024",
    metSourceDescription: "Calisthenics (e.g., curl ups, abdominal crunches, plank), light effort",
  },
  {
    name: "Angkat Beban (Ringan)",
    category: "Kekuatan",
    metValue: 3.5,
    caloriesPerHour: 245,
    metCode: "02054",
    metSourceDescription: "Resistance (weight) training, multiple exercises, 8-15 reps at varied resistance",
  },
  {
    name: "Angkat Beban (Sedang)",
    category: "Kekuatan",
    metValue: 5.0,
    caloriesPerHour: 350,
    metCode: "02052",
    metSourceDescription: "Resistance (weight) training, squats, deadlift, slow or explosive effort",
  },
  {
    name: "Squat",
    category: "Kekuatan",
    metValue: 5.0,
    caloriesPerHour: 350,
    metCode: "02052",
    metSourceDescription: "Resistance (weight) training, squats, deadlift, slow or explosive effort",
  },
  {
    name: "Yoga",
    category: "Fleksibilitas",
    metValue: 2.3,
    caloriesPerHour: 161,
    metCode: "02175",
    metSourceDescription: "Yoga, General",
  },
  {
    name: "Pilates",
    category: "Fleksibilitas",
    metValue: 2.8,
    caloriesPerHour: 196,
    metCode: "02105",
    metSourceDescription: "Pilates, general",
  },
  {
    name: "Stretching",
    category: "Fleksibilitas",
    metValue: 2.3,
    caloriesPerHour: 161,
    metCode: "02101",
    metSourceDescription: "Stretching, mild",
  },
  {
    name: "Badminton",
    category: "Olahraga",
    metValue: 5.5,
    caloriesPerHour: 385,
    metCode: "15030",
    metSourceDescription: "Badminton, social singles and doubles, general",
  },
  {
    name: "Futsal / Sepak Bola",
    category: "Olahraga",
    metValue: 7.8,
    caloriesPerHour: 546,
    metCode: "15195",
    metSourceDescription: "Futsal",
  },
  {
    name: "Bola Basket",
    category: "Olahraga",
    metValue: 7.5,
    caloriesPerHour: 525,
    metCode: "15055",
    metSourceDescription: "Basketball, general",
  },
  {
    name: "Voli",
    category: "Olahraga",
    metValue: 3.0,
    caloriesPerHour: 210,
    metCode: "15720",
    metSourceDescription: "Volleyball, non-competitive, 6 - 9 member team, general",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB terhubung");

    await Food.deleteMany({});
    await ActivityType.deleteMany({});
    console.log("🗑️  Data lama dihapus");

    await Food.insertMany(foods);
    console.log(`🍽️  ${foods.length} data makanan (sumber: TKPI 2017, Kemenkes RI) berhasil dimasukkan`);

    await ActivityType.insertMany(activityTypes);
    console.log(
      `🏃  ${activityTypes.length} jenis olahraga (sumber: Compendium of Physical Activities 2011) berhasil dimasukkan`,
    );

    console.log("✨ Seeding selesai!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding gagal:", err.message);
    process.exit(1);
  }
}

seed();
