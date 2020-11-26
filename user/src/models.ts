import { Schema as MongooseSchema } from "mongoose";

export namespace Schema {
  export const User = new MongooseSchema(
    {
      fullname: { type: String, required: true },
    },
    { timestamps: true, collection: "users" }
  );
}
