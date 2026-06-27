import Joi from "joi";

export const updateProfileValidation = Joi.object({
  name: Joi.string().min(3).optional().messages({
    "string.min": "Nama minimal harus {#limit} karakter",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Format email tidak valid",
  }),
  age: Joi.number().integer().min(10).max(120).optional().messages({
    "number.base": "Usia harus berupa angka",
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
    .optional()
    .messages({
      "any.only": "Level aktivitas tidak valid",
    }),
}).min(1).messages({
  "object.min": "Minimal satu field harus diisi untuk update profil",
});
