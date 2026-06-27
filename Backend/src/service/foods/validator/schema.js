import Joi from "joi";

export const searchQueryValidation = Joi.object({
  search: Joi.string().optional().allow(""),
  category: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
