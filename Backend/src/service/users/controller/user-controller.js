import userRepository from "../repositories/user-repositories.js";
import response from "../../../utils/response.js";
import { NotFoundError, InvariantError } from "../../../exceptions/index.js";

// GET /api/users/me
export const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) throw new NotFoundError("Pengguna tidak ditemukan.");
    return response(res, 200, "Data profil berhasil diambil", user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const updateData = req.validated;

    // Cegah duplikasi email jika diubah
    if (updateData.email) {
      const existing = await userRepository.findByEmail(updateData.email);
      if (existing && existing._id.toString() !== req.user.id) {
        throw new InvariantError("Email sudah digunakan oleh akun lain.");
      }
    }

    const updated = await userRepository.updateUser(req.user.id, updateData);
    if (!updated) throw new NotFoundError("Pengguna tidak ditemukan.");

    return response(res, 200, "Profil berhasil diperbarui", updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/me
export const deleteAccount = async (req, res, next) => {
  try {
    const deleted = await userRepository.deleteUser(req.user.id);
    if (!deleted) throw new NotFoundError("Pengguna tidak ditemukan.");
    return response(res, 200, "Akun berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};
