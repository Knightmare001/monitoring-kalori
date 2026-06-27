import User from "../../../models/User.js";

class UserRepository {
  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("-password");
  }

  async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
