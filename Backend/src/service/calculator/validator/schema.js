import Joi from "joi";

export const calculatorValidation = Joi.object({
  age: Joi.number().integer().min(10).max(120).required().messages({
    "number.base": "Usia harus berupa angka",
    "any.required": "Usia wajib diisi",
  }),
  gender: Joi.string().valid("Laki-laki", "Perempuan").required().messages({
    "any.only": "Gender harus Laki-laki atau Perempuan",
    "any.required": "Gender wajib diisi",
  }),
  height: Joi.number().positive().required().messages({
    "number.base": "Tinggi badan harus berupa angka positif",
    "any.required": "Tinggi badan wajib diisi",
  }),
  weight: Joi.number().positive().required().messages({
    "number.base": "Berat badan harus berupa angka positif",
    "any.required": "Berat badan wajib diisi",
  }),
  activityLevel: Joi.string()
    .valid("sedentary", "light", "moderate", "active", "very_active")
    .required()
    .messages({
      "any.only":
        "Level aktivitas harus salah satu dari: sedentary, light, moderate, active, very_active",
      "any.required": "Level aktivitas wajib diisi",
    }),
});
