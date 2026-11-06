import mongoose from "mongoose";
import { MONGODB_URI } from "@/config";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially during
 * API Route usage.
 */
const globalForMongo = globalThis as unknown as {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

export const dbConnect = async (): Promise<typeof mongoose> => {
  if (globalForMongo.mongoose?.conn) {
    return globalForMongo.mongoose.conn;
  }

  if (!globalForMongo.mongoose?.promise) {
    globalForMongo.mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI).then((mongoose) => {
        globalForMongo.mongoose!.conn = mongoose;
        return mongoose;
      }),
    };
  }

  const mongooseInstance = await globalForMongo.mongoose.promise;
  if (!mongooseInstance) {
    throw new Error("Failed to connect to MongoDB");
  }
  return mongooseInstance;
};
