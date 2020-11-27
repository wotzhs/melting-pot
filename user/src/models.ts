import { Schema as MongooseSchema } from "mongoose";

export namespace Schema {
  export const User = new MongooseSchema(
    {
      fullname: { type: String, required: true },
    },
    { timestamps: true, collection: "users" }
  );
}

Schema.User.set("toJSON", {
  transform: idTransformer,
});

function idTransformer(doc, ret, opts) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}
