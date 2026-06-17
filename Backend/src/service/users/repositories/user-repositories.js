import User from "../../../models/User.js";

class UserRepositories {
  // Mencari user berdasarkan email (untuk validasi registrasi/login)
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Mencari user berdasarkan ID (untuk profil/edit/hapus)
  async findById(id) {
    return await User.findById(id).select("-password"); // Sembunyikan password demi keamanan
  }

  // Membuat user baru
  async createUser({ name, email, password }) {
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    return newUser._id;
  }

  // Memperbarui data user
  async updateUser(id, updateData) {
    // new: true untuk mengembalikan data terbaru setelah di-update
    // runValidators: true agar Mongoose tetap mengecek validasi skema saat update
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password"); // Sembunyikan password demi keamanan
  }

  // Menghapus user
  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepositories();
