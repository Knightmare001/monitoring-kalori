import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
    },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
    },
    height: { type: Number }, // dalam cm
    weight: { type: Number }, // dalam kg
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "sedentary",
    },
  },
  { timestamps: true },
);

// Pre-save hook: enkripsi password sebelum disimpan
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method untuk membandingkan password saat login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
