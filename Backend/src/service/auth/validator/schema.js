import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "string.min": "Nama minimal harus {#limit} karakter",
    "any.required": "Nama wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal harus {#limit} karakter",
    "any.required": "Password wajib diisi",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "Konfirmasi password tidak cocok",
    "any.required": "Konfirmasi password wajib diisi",
  }),
  age: Joi.number().integer().min(10).max(120).optional().messages({
    "number.base": "Usia harus berupa angka",
    "number.min": "Usia minimal 10 tahun",
  }),
  gender: Joi.string().valid("Laki-laki", "Perempuan").optional().messages({
    "any.only": "Gender harus Laki-laki atau Perempuan",
  }),
  height: Joi.number().positive().optional().messages({
    "number.base": "Tinggi badan harus berupa angka positif",
  }),
  weight: Joi.number().positive().optional().messages({
    "number.base": "Berat badan harus berupa angka positif",
  }),
  activityLevel: Joi.string()
    .valid("sedentary", "light", "moderate", "active", "very_active")
    .optional(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password wajib diisi",
  }),
});
