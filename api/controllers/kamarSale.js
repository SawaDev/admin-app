import KamarSales from "../models/KamarSales.js";
import Kamar from "../models/Kamar.js";

//create sale
export const createSale = async (req, res, next) => {
  const newSale = new KamarSales(req.body);
  const id = req.body.kamarId;

  try {
    const savedSale = await newSale.save();
    res.status(200).json(savedSale);
  } catch (err) {
    next(err);
  }
}

//get sales by id
export const getSales = async (req, res, next) => {
  const id = req.params.id;
  try {
    const sales = await KamarSales.find({ kamarId: id });
    !sales && res.status(404).json("No sales");
    let sumKeldi = 0;
    let sumKetdi = 0;
    for (let i = 0; i < sales.length; i++) {

      sumKeldi += sales[i].keldi;
      sumKetdi += sales[i].ketdi;
    }
    res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
}

//daily sales
export const dailySales = async (req, res, next) => {
  const id = req.params.id;
  const startDate = req.query.start;
  const endDate = req.query.end;
  try {

    const sales = await KamarSales.aggregate([
      {
        $match: {
          $and: [
            { "kamarId": id },
            { "createdAt": { $gte: new Date(startDate), $lte: new Date(endDate) } }
          ]
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalKeldi: { $sum: "$keldi" },
          totalKetdi: { $sum: "$ketdi" }
        }
      },
      {
        $sort: {_id: 1}
      }
    ]);
    !sales && res.status(404).json("No sales");

    res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
}