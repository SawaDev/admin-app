import mongoose, { SchemaTypes } from "mongoose";

const KamarSalesSchema = new mongoose.Schema(
  {
    kamarId: {
      type: String,
      required: true
    },
    keldi: {
      type: Number,
      default: 0,
      min: 0,
    },
    ketdi: {
      type: Number,
      default: 0,
      min: 0,
    },
    customerId: {
      type: SchemaTypes.ObjectId,
      ref: 'Customer',
    }
  },
  { timestamps: true }
)

export default mongoose.model("KamarSales", KamarSalesSchema) 