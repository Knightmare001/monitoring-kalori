import Joi from "joi";

export const createWeightValidation = Joi.object({
  weight: Joi.number().positive().required().messages({
    "number.base": "Berat badan harus berupa angka",
    "number.positive": "Berat badan harus lebih dari 0",
    "any.required": "Berat badan wajib diisi",
  }),
  note: Joi.string().max(200).optional().allow(""),
  recordedAt: Joi.date().iso().optional(),
});
