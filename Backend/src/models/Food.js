import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String }, // misal: "Nasi & Umbi", "Lauk Pauk", "Sayuran", "Buah"
    servingSize: { type: Number, required: true }, // gram per 1 porsi
    servingUnit: { type: String, default: "gram" }, // "gram", "ml", "buah", dll
    calories: { type: Number, required: true }, // kkal per porsi
    carbs: { type: Number, required: true }, // gram karbohidrat per porsi
    protein: { type: Number, required: true }, // gram protein per porsi
    fat: { type: Number, required: true }, // gram lemak per porsi

    // Jejak sumber data (transparansi/audit trail untuk keperluan akademik)
    tkpiCode: { type: String }, // kode resmi di TKPI 2017, mis. "AP001"
    tkpiName: { type: String }, // nama baku sesuai TKPI 2017
  },
  { timestamps: true },
);

// Index untuk fitur pencarian
FoodSchema.index({ name: "text", category: "text" });

export default mongoose.model("Food", FoodSchema);
