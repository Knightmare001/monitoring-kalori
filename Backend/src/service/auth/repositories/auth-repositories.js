import User from "../../../models/User.js";

class AuthRepository {
  async findByEmail(email) {
    // Sertakan password karena dibutuhkan saat login untuk dibandingkan
    return await User.findOne({ email });
  }

  async createUser(data) {
    const newUser = new User(data);
    await newUser.save();
    return newUser._id;
  }
}

export default new AuthRepository();
