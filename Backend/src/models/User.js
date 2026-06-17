import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true, // Email tidak boleh kembar di database
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
    },
    age: Number,
    gender: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
    },
    height: Number, // dalam cm
    weight: Number, // dalam kg
  },
  {
    timestamps: true, // Otomatis membuat kolom createdAt dan updatedAt
  },
);

UserSchema.pre("save", async function (next) {
  // Jika field password tidak dimodifikasi (misal hanya update data berat badan), lewati hashing
  if (!this.isModified("password")) return next();

  // Proses enkripsi password menggunakan salt round 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", UserSchema);
