import foodRepository from "../repositories/food-repositories.js";
import response from "../../../utils/response.js";
import { NotFoundError } from "../../../exceptions/index.js";

// GET /api/foods?search=nasi&category=Nasi&page=1&limit=20
export const getAllFoods = async (req, res, next) => {
  try {
    const { search = "", category = "", page = 1, limit = 20 } = req.validate ?? req.query;

    const result = await foodRepository.findAll({
      search,
      category,
      page: Number(page),
      limit: Number(limit),
    });

    return response(res, 200, "Data makanan berhasil diambil", {
      foods: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/foods/:id
export const getFoodById = async (req, res, next) => {
  try {
    const food = await foodRepository.findById(req.params.id);
    if (!food) throw new NotFoundError("Makanan tidak ditemukan.");
    return response(res, 200, "Detail makanan berhasil diambil", food);
  } catch (err) {
    next(err);
  }
};
