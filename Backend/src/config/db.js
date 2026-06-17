import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Mencoba melakukan koneksi menggunakan URI dari file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Koneksi MongoDB: ${error.message}`);
    // Menghentikan aplikasi jika gagal koneksi database
    process.exit(1);
  }
};

export default connectDB;
