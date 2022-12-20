import Kamar from "../models/Kamar.js";
import KamarSales from "../models/KamarSales.js";
import mongoose from "mongoose";
import { request } from "express";

export const createKamar = async (req, res, next) => {
    const newKamar = new Kamar(req.body);
    const allKamars = await Kamar.find();

    const result = allKamars.map((k) => {
        if (k.category === req.body.category && k.color === req.body.color && k.size === req.body.size && k.temir === req.body.temir) {
            return true;
        } else {
            return false;
        }
    })

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    if (contains(result, true)) {
        res.status(400).json("This type already exists!");
    } else {
        try {
            const savedKamar = await newKamar.save();
            res.status(200).json(savedKamar);
        } catch (err) {
            next(err);
        }
    }

};


export const updateKamar = async (req, res, next) => {
    try {
        const updateKamar = await Kamar.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updateKamar);
    } catch (err) {
        next(err);
    }
};

export const deleteKamar = async (req, res, next) => {
    try {
        await Kamar.findByIdAndDelete(req.params.id);
        await KamarSales.deleteMany({ "kamarId": req.params.id })
        res.status(200).json("Kamar has been deleted");
    } catch (err) {
        next(err);
    }
};

export const getKamar = async (req, res, next) => {
    try {
        const kamar = await Kamar.findById(req.params.id);
        res.status(200).json(kamar);
    } catch (err) {
        next(err);
    }
};

export const getKamars = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
        const kamars = await Kamar.find({
            ...others,
            cheapestPrice: { $gt: min | 1, $lt: max || 999 },
        }).limit(req.query.limit);
        res.status(200).json(kamars);
    } catch (err) {
        next(err);
    }
};

export const getWarehouse = async (req, res, next) => {
    try {
        const kamars = await Kamar.aggregate([
            {
                $group: {
                    _id: null,
                    totalSoni: { $sum: "$soni" },
                    totalMoney: {
                        $sum: {
                            $multiply: ["$soni", "$price"]
                        }
                    },
                    count: { $sum: 1 },
                }
            }
        ]);

        res.status(200).json(kamars)
    } catch (err) {
        next(err);
    }
};

export const getIncome = async (req, res, next) => {
    const kamarId = req.query.kamarId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Kamar.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                    ...(kamarId && { _id: new mongoose.Types.ObjectId(kamarId) })
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    soni: { $sum: "$soni" },
                    money: {
                        $sum: {
                            $multiply: ["$soni", "$price"]
                        }
                    }
                },
            },
            {
                $group: {
                    _id: "$month",
                    monthlySoni: { $sum: "$soni" },
                    monthlyMoney: { $sum: "$money" }
                }
            }
        ])
        res.status(200).json(income);
    } catch (err) {
        next(err);
    }
};

export const getPie = async (req, res, next) => {
    const filter = req.query.filter;

    try {
        const pieData = await Kamar.aggregate([
            {
                $project: {
                    filterBy: `$${filter}`,
                    soni: { $sum: "$soni" },
                    money: {
                        $sum: {
                            $multiply: ["$soni", "$price"]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$filterBy",
                    totalSoni: { $sum: "$soni" },
                    totalMoney: { $sum: "$money" },
                }
            }
        ])
        res.status(200).json(pieData);
    } catch (err) {
        next(err);
    }
};

export const test = async (req, res, next) => {
    try{
        const data = await KamarSales.aggregate([
            {
                $lookup: {
                    from: "Kamar",
                    localField: "kamarId",
                    foreignField: "_id",
                    as: "details",
                }
            }
        ])
        res.status(200).json(data);
    }catch(err){
        next(err);
    }
};

export const getMonthlyStats = async (req, res, next) => {
    const id = req.query.id;
    const filterBy = req.query.filterBy;
    const date = new Date();
    const lastYear = new Date(new Date().setFullYear(date.getFullYear() - 1));
    const kamar = await Kamar.findById(id);
    const kamars = await Kamar.find();

    if ( filterBy === "money" ) {
        try {
            const data = await KamarSales.aggregate([
                {
                    $match: {
                        createdAt: { $gte: lastYear },
                        ...(id && { kamarId: id })
                    }
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        keldiInMoney: {
                            ...(
                                kamar ? { $sum: { $multiply: ["$keldi", kamar.price] } } : { $sum: "$keldi" }
                            )
                        },
                        ketdiInMoney: {
                            ...(
                                kamar ? { $sum: { $multiply: ["$ketdi", kamar.price] } } : { $sum: "$ketdi" }
                            )
                        },
                        keldiInNumber: { $sum: "$keldi" },
                        ketdiInNumber: { $sum: "$ketdi" },
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        monthlyKeldi: { $sum: "$keldiInMoney" },
                        monthlyKetdi: { $sum: "$ketdiInMoney" }
                    }
                }
            ])
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    } else if( filterBy === "number" ){
        try {
            const data = await KamarSales.aggregate([
                {
                    $match: {
                        createdAt: { $gte: lastYear },
                        ...(id && { kamarId: id })
                    }
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        keldiInMoney: {
                            ...(
                                kamar ? { $sum: { $multiply: ["$keldi", kamar.price] } } : { $sum: "$keldi" }
                            )
                        },
                        ketdiInMoney: {
                            ...(
                                kamar ? { $sum: { $multiply: ["$ketdi", kamar.price] } } : { $sum: "$ketdi" }
                            )
                        },
                        keldiInNumber: { $sum: "$keldi" },
                        ketdiInNumber: { $sum: "$ketdi" },
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        monthlyKeldi: { $sum: "$keldiInNumber" },
                        monthlyKetdi: { $sum: "$ketdiInNumber" }
                    }
                }
            ])
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }
};
