import mongoose from "mongoose";

const WeightTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: { type: Number, required: true }, // dalam kg
    note: { type: String, default: "" },      // catatan opsional
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

WeightTrackerSchema.index({ userId: 1, recordedAt: -1 });

export default mongoose.model("WeightTracker", WeightTrackerSchema);
