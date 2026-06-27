import mongoose from "mongoose";

const DailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    serving: { type: Number, required: true, min: 0.1 }, // jumlah porsi (bisa desimal, misal 0.5)
    // Snapshot nilai gizi saat dicatat (agar tidak berubah jika data Food diedit)
    snapshot: {
      name: String,
      calories: Number,
      carbs: Number,
      protein: Number,
      fat: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index untuk query cepat per user per tanggal
DailyLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model("DailyLog", DailyLogSchema);
