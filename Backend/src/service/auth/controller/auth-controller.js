import jwt from "jsonwebtoken";
import authRepository from "../repositories/auth-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, AuthenticationError } from "../../../exceptions/index.js";

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, height, weight, activityLevel } = req.validated;

    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw new InvariantError("Email sudah terdaftar. Gunakan email lain.");
    }

    const userId = await authRepository.createUser({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
    });

    return response(res, 201, "Registrasi berhasil", { userId });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Email atau password salah.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError("Email atau password salah.");
    }

    // Buat JWT dengan payload minimal
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT, {
      expiresIn: "7d",
    });

    return response(res, 200, "Login berhasil", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
