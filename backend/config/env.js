import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  ARCJET_KEY: process.env.ARCJET_KEY,
};
