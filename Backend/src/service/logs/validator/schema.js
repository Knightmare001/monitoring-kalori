import Joi from "joi";

export const createLogValidation = Joi.array()
  .items(
    Joi.object({
      foodId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
          "string.pattern.base": "foodId harus berupa MongoDB ObjectId yang valid",
          "any.required": "foodId wajib diisi",
        }),
      serving: Joi.number().positive().required().messages({
        "number.base": "Jumlah porsi harus berupa angka",
        "number.positive": "Jumlah porsi harus lebih dari 0",
        "any.required": "Jumlah porsi wajib diisi",
      }),
    }),
  )
  .min(1)
  .messages({
    "array.base": "Data yang dikirim harus berupa daftar/array makanan",
    "array.min": "Minimal harus memasukkan 1 makanan",
  });
