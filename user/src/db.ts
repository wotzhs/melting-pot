import mongoose from "mongoose";

export default class DB {
  static connect() {
    return mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/user",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    );
  }
}
