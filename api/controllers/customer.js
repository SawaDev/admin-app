import Customer from "../models/Customer.js";
import Kamar from "../models/Kamar.js";
import KamarSales from "../models/KamarSales.js";

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find()
      .populate({
        path: 'sales',
        populate: {
          path: 'kamarId',
          model: 'Kamar'
        }
      });

    const formattedCustomers = customers.map((customer) => {
      const formattedSales = customer.sales.map((sale) => {
        const singleSale = sale.ketdi * sale.kamarId.price;
        const { ketdi, createdAt } = { ...sale.toObject() }
        return {
          // ...sale.toObject(),
          ketdi,
          createdAt,
          singleSale,
          formattedSingleSale: singleSale.toLocaleString()
        };
      });

      const totalSales = formattedSales.reduce((total, sale) => total + sale.singleSale, 0);

      return {
        _id: customer._id,
        name: customer.name,
        totalSales,
        formattedTotalSales: totalSales.toLocaleString(),
        sales: formattedSales
      };
    });

    res.status(200).json(formattedCustomers);
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate({
        path: 'sales',
        populate: {
          path: 'kamarId',
          model: 'Kamar'
        }
      });

    const formattedSales = customer.sales.map((sale) => {
      const singleSale = sale.ketdi * sale.kamarId.price;
      const { ketdi, createdAt } = { ...sale.toObject() }
      const { category, size, temir, color, price, _id } = { ...sale.kamarId.toObject() }
      return {
        ketdi,
        createdAt,
        singleSale,
        formattedSingleSale: singleSale.toLocaleString(),
        category, size, temir, color, price,
        kamarId: _id
      };
    });

    const totalSales = formattedSales.reduce((total, sale) => total + sale.singleSale, 0);

    const formattedOuput = {
      _id: customer._id,
      name: customer.name,
      totalSales,
      formattedTotalSales: totalSales.toLocaleString(),
      sales: formattedSales
    }

    res.status(200).json(formattedOuput);
  } catch (err) {
    next(err);
  }
}