import { Schema as MongooseSchema } from "mongoose";

export namespace Schema {
  export const Account = new MongooseSchema(
    {
      fullname: String,
    },
    { timestamps: true, collection: "accounts" }
  );
}
