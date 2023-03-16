import KamarSales from "../models/KamarSales.js";
import Kamar from "../models/Kamar.js";
import Customer from "../models/Customer.js";

//create sale
export const createSale = async (req, res, next) => {
  try {
    const { ketdi, kamarId, customerName } = req.body;

    const customer = await Customer.findOne({ name: customerName })

    if (!customer) {
      const newCustomer = await Customer.create({
        name: customerName.toLowerCase(),
      });

      const newSale = await KamarSales.create({
        ketdi,
        kamarId,
        customerId: newCustomer._id
      });

      await Customer.findByIdAndUpdate(
        { _id: newCustomer._id },
        { $push: { sales: newSale._id } },
        { new: true }
      )

      const currentKamar = await Kamar.findById({ _id: kamarId });
      const currentSoni = currentKamar.soni;
      const newSoni = currentSoni - ketdi;
      if (newSoni < 0) {
        throw new Error('In warehouse you have ' + currentSoni + ' ta kamar');
      }
      await Kamar.updateOne(
        { _id: kamarId },
        {
          $set: {
            soni: newSoni
          }
        }
      )

      const savedSale = await newSale.save();
      res.status(200).json(savedSale);
    } else {
      const newSale = new KamarSales({
        ketdi,
        kamarId,
        customerId: customer._id
      });

      await Customer.findByIdAndUpdate(
        { _id: customer._id },
        { $push: { sales: newSale._id } },
        { new: true }
      )

      const currentKamar = await Kamar.findById({ _id: kamarId });
      const currentSoni = currentKamar.soni;
      const newSoni = currentSoni - ketdi;
      if (newSoni < 0) {
        throw new Error('In warehouse you have ' + currentSoni + ' ta kamar');
      }
      await Kamar.updateOne(
        { _id: kamarId },
        {
          $set: {
            soni: newSoni
          }
        }
      )

      const savedSale = await newSale.save();

      res.status(200).json(savedSale);
    }
  } catch (err) {
    next(err);
  }
}

export const newCollection = async (req, res, next) => {
  try {
    const { keldi, kamarId } = req.body;
    const newSale = new KamarSales({
      keldi,
      kamarId,
    });

    const currentKamar = await Kamar.findById({ _id: kamarId });
    const currentSoni = currentKamar.soni;
    const newSoni = currentSoni + keldi;
    if (newSoni < 0) {
      throw new Error('In warehouse you have ' + currentSoni + ' ta kamar');
    }

    await Kamar.updateOne(
      { _id: kamarId },
      {
        $set: {
          soni: newSoni
        }
      }
    )

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
        $sort: { _id: 1 }
      }
    ]);
    !sales && res.status(404).json("No sales");

    res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
}