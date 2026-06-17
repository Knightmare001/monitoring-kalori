import Joi from "joi";

// 1. Skema Validasi untuk Register
export const registerValidation = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "string.min": "Nama minimal harus {#limit} karakter",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal harus {#limit} karakter",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "Konfirmasi password tidak cocok dengan password",
    "any.required": "Konfirmasi password wajib diisi",
  }),
  // Validasi data fisik untuk kebutuhan rumus Mifflin-St Jeor:
  // age: Joi.number().integer().min(1).max(120).required().messages({
  //   "number.base": "Usia harus berupa angka",
  //   "number.min": "Usia tidak valid",
  // }),
  // gender: Joi.string().valid("Laki-laki", "Perempuan").required().messages({
  //   "any.only": "Gender harus Laki-laki atau Perempuan",
  // }),
  // height: Joi.number().positive().required().messages({
  //   "number.base": "Tinggi badan harus berupa angka",
  // }),
  // weight: Joi.number().positive().required().messages({
  //   "number.base": "Berat badan harus berupa angka",
  // }),
});

// 2. Skema Validasi untuk Login
export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password tidak boleh kosong",
  }),
});
