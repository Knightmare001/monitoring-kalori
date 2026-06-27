import Food from "../../../models/Food.js";

class FoodRepository {
  async findAll({ search, category, page, limit }) {
    const filter = {};

    if (search) {
      // Pencarian case-insensitive pada nama makanan
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Food.find(filter).skip(skip).limit(limit).sort({ name: 1 }),
      Food.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findById(id) {
    return await Food.findById(id);
  }
}

export default new FoodRepository();
