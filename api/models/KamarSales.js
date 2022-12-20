import mongoose from "mongoose";

const KamarSalesSchema = new mongoose.Schema(
  {
    kamarId: {
      type: String,
      required: true
    },
    keldi: {
      type: Number,
      default: 0,
    },
    ketdi: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
)

export default mongoose.model("KamarSales", KamarSalesSchema) 