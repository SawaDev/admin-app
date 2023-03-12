import Kamar from "../models/Kamar.js";
import KamarSales from "../models/KamarSales.js";
import mongoose from "mongoose";

export const createKamar = async (req, res, next) => {
    try {
        const newKamar = new Kamar(req.body);
        const allKamars = await Kamar.find();

        const exists = allKamars.some(k => k.category === req.body.category && k.color === req.body.color && k.size === req.body.size && k.temir === req.body.temir);

        if (exists) {
            return res.status(400).send({ error: "This type already exists!" });
        }

        const savedKamar = await newKamar.save();
        res.status(200).json(savedKamar);
    } catch (err) {
        next(err);
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
    try {
        const kamars = await Kamar.find();
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
    try {
        // const kamarTemp = [
        //     {
        //         keldi: 300,
        //         ketdi: 200,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        //     {
        //         keldi: 1000,
        //         ketdi: 3000,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        //     {
        //         keldi: 0,
        //         ketdi: 2000,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        //     {
        //         keldi: 500,
        //         ketdi: 900,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        //     {
        //         keldi: 1200,
        //         ketdi: 800,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        //     {
        //         keldi: 4000,
        //         ketdi: 0,
        //         kamarId: "63da189952948df7efe94969"
        //     },
        // ]

        // KamarSales.create(kamarTemp, (error, documents) => {
        //     if (error) {
        //         console.error(error);
        //     } else {
        //         console.log('Users saved successfully: ', documents);
        //     }
        //     mongoose.connection.close();
        // });

        // const kamar = new Kamar(kamarTemp)
        // await kamar.save()
        // res.status(200).json(kamar);
    } catch (err) {
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

    if (filterBy === "money") {
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
    } else if (filterBy === "number") {
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
