import { Schema as MongooseSchema } from "mongoose";

export namespace Schema {
  export const Account = new MongooseSchema(
    {
      fullname: { type: String, required: true },
    },
    { timestamps: true, collection: "accounts" }
  );
}
