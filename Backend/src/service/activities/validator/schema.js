import Joi from "joi";

export const createActivityLogValidation = Joi.object({
  activityTypeId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "activityTypeId harus berupa MongoDB ObjectId yang valid",
      "any.required": "activityTypeId wajib diisi",
    }),
  durationMinutes: Joi.number().integer().min(1).required().messages({
    "number.base": "Durasi harus berupa angka",
    "number.min": "Durasi minimal 1 menit",
    "any.required": "Durasi wajib diisi",
  }),
});

export const activityQueryValidation = Joi.object({
  search: Joi.string().optional().allow(""),
  category: Joi.string().optional(),
});
