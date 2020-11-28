import { Schema as MongooseSchema } from "mongoose";
import { ObjectId } from "mongodb";

export namespace Schema {
  export const User = new MongooseSchema(
    {
      fullname: { type: String, required: true, unique: true },
    },
    { timestamps: true, collection: "users" }
  );

  export const UserOverview = new MongooseSchema(
    {
      userId: ObjectId,
      fullname: String,
      walletId: String,
      walletBalance: Number,
      cardNumber: String,
    },
    {
      timestamps: { createdAt: false, updatedAt: true },
      collection: "UserOverview",
    }
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
