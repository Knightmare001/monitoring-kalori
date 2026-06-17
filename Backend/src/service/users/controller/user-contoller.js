import userRepositories from "../repositories/user-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js"; // Sesuaikan dengan folder custom error Anda

// 1. REGISTRASI / CREATE USER
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated;

    // VALIDASI: Cek apakah email sudah terdaftar
    const existingUser = await userRepositories.findByEmail(email);
    if (existingUser) {
      throw new InvariantError("Email sudah terdaftar, silakan gunakan email lain.");
    }

    const userId = await userRepositories.createUser({ name, email, password });

    return response(res, 201, "Registrasi berhasil", { userId });
  } catch (error) {
    next(error); // Dilempar ke ErrorHandler global Anda
  }
};

// 2. GET USER PROFILE (Melihat data diri sendiri)
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user.id biasanya didapatkan dari middleware autentikasi JWT Anda
    const userId = req.user.id;

    const user = await userRepositories.findById(userId);
    if (!user) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    return response(res, 200, "Berhasil mengambil data profil", user);
  } catch (error) {
    next(error);
  }
};

// 3. EDIT / UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // Diambil dari token JWT
    const { name, email } = req.validated; // Ambil dari data yang sudah divalidasi Joi

    // Jika user mengubah email, cek apakah email baru tersebut sudah dipakai orang lain
    if (email) {
      const existingUser = await userRepositories.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new InvariantError("Email sudah digunakan oleh akun lain.");
      }
    }

    const updatedUser = await userRepositories.updateUser(userId, { name, email });

    return response(res, 200, "Profil berhasil diperbarui", updatedUser);
  } catch (error) {
    next(error);
  }
};

// 4. DELETE USER (Opsional, jika akun ingin bisa dihapus)
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deleted = await userRepositories.deleteUser(userId);
    if (!deleted) {
      throw new NotFoundError("User gagal dihapus atau tidak ditemukan.");
    }

    return response(res, 200, "Akun berhasil dihapus selamanya", null);
  } catch (error) {
    next(error);
  }
};
