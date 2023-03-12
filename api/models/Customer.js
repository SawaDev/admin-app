import mongoose, { SchemaTypes } from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cash: {
      type: Number,
      default: 0,
    },
    sales: [{
      type: SchemaTypes.ObjectId,
      ref: 'KamarSales',
    }]
  }, { timestamps: true }
)

export default mongoose.model("Customer", CustomerSchema);