import jwt from "jsonwebtoken";
import { AuthenticationError } from "../exceptions/index.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT);

    // Menyimpan payload token ke req.user agar bisa diakses di controller
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AuthenticationError("Sesi telah berakhir. Silakan login kembali."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AuthenticationError("Token tidak valid."));
    }
    next(err);
  }
};

export default authenticate;
