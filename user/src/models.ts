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
      fullname: { type: String, index: true },
      walletId: { type: String, index: true },
      walletBalance: Number,
      cardNumber: { type: String, index: true },
    },
    {
      timestamps: { createdAt: false, updatedAt: true },
      collection: "useroverview",
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
