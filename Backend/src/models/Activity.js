import mongoose from "mongoose";

// Daftar jenis olahraga (master data)
const ActivityTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String }, // "Kardio", "Kekuatan", "Fleksibilitas", dll
    metValue: { type: Number, required: true }, // MET (Metabolic Equivalent of Task)
    caloriesPerHour: { type: Number }, // estimasi kalori terbakar per jam untuk berat 70 kg

    // Jejak sumber data (transparansi/audit trail untuk keperluan akademik)
    metCode: { type: String }, // 5-digit activity code resmi di Compendium, mis. "12020"
    metSourceDescription: { type: String }, // deskripsi asli (Bahasa Inggris) dari dokumen sumber
  },
  { timestamps: true },
);

// Log olahraga harian pengguna
const ActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityType",
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 }, // durasi dalam menit
    caloriesBurned: { type: Number }, // dikalkulasi otomatis di controller
    snapshot: {
      name: String,
      metValue: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

ActivityLogSchema.index({ userId: 1, date: -1 });

export const ActivityType = mongoose.model("ActivityType", ActivityTypeSchema);
export const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
