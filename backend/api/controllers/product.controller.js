import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios"
import { asyncHandler } from "../utils/asyncHandler.js";

const postSeededData = asyncHandler(async (req, res) => {
    let response;
    await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
        .then(res => {
            response = res.data
        })
        .catch(err => console.log(err))

    if (!response || response.length === 0) throw new ApiError(404, "No Response Found");

    try {
        await Promise.all(response.map(async (element) => {
            const newProduct = await Product.create({
                title: element.title,
                price: element.price,
                description: element.description,
                category: element.category,
                image: element.image,
                sold: element.sold,
                dateOfSale: element.dateOfSale
            });

            if (!newProduct) throw new ApiError(403, "Error occurred while saving seeded data");
        }));

        console.log("ALL PRODUCTS CREATED SUCCESSFULLY")
        return res.status(200).json(
            new ApiResponse(200,[],"Products added to the DB")
        )
    } catch (error) {
        throw new ApiError(500, "Error saving products: " + error.message);
    }
});


const getAllTransactions = asyncHandler(async (req, res) => {
    const { month } = req.params;
    const { q: searchText, } = req.query;
    let page = Number(req.query.page)||1;
    let limit = Number(req.query.limit)||10

    
    let monthIndex = month ? parseInt(month, 10) - 1 : null;

    let query={};
    if (searchText) {
        query.$or= [
            { title: { $regex: searchText, $options:'i' } }, 
            { description: { $regex: searchText, $options:'i' } }, 
        ];
        const priceValue = Number(searchText);
        if (!isNaN(priceValue)) {
            query.$or.push({ price: { $eq: priceValue } });
        }
    }
    
    let transactions=await Product.find(query);
    let totalCount=0
    if (monthIndex){
        transactions=transactions.filter(transaction => {
            return transaction.dateOfSale && transaction.dateOfSale.getMonth() === monthIndex;
        })
        totalCount=transactions.length
    } 

    if (!transactions || transactions.length==0) throw new ApiError(404, "Products Not Found");
    transactions=transactions.slice((page - 1) * limit, page * limit)
    return res.status(200).json(
        new ApiResponse(200, {transactions,totalCount}, "All Transactions Fetched")
    )
})

const getStatistics = asyncHandler(async (req, res) => {
    const { month } = req.params;
    const monthIndex = parseInt(month, 10) - 1;


    const products = await Product.find();
    const askedStats = products.filter(product => 
        product.dateOfSale && product.dateOfSale.getMonth() === monthIndex
    );

    if (!askedStats.length) throw new ApiError(404, "Stats Not Found");
    let totalSale = 0;
    askedStats.forEach(product => {
        totalSale += Number(product.price);
    });
    totalSale=totalSale.toFixed(2)
    const totalItemsSold = askedStats.filter(product => product.sold === true).length;
    const totalNotSoldItems = askedStats.filter(product => product.sold === false).length;

    return res.status(200).json(
        new ApiResponse(200, { totalSale, totalItemsSold, totalNotSoldItems }, "Stats Fetched")
    );
})

const getUniqueCategories = asyncHandler(async (req, res) => {
    const { month } = req.params;
    const monthInt = parseInt(month);

    const categories = await Product.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthInt]
                }
            }
        },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1
            }
        }
    ]);
    if (!categories.length) throw new ApiError(404, "Categories Not Found");


    res.status(200).json(
        new ApiResponse(200, categories, "Categories Data Fetched")
    );

})

const getMonthlyPriceRange = asyncHandler(async (req, res) => {
    const { month } = req.params;

    const priceRanges = [
        { range: "0 - 100", count: 0 },
        { range: "101 - 200", count: 0 },
        { range: "201 - 300", count: 0 },
        { range: "301 - 400", count: 0 },
        { range: "401 - 500", count: 0 },
        { range: "501 - 600", count: 0 },
        { range: "601 - 700", count: 0 },
        { range: "701 - 800", count: 0 },
        { range: "801 - 900", count: 0 },
        { range: "901 - above", count: 0 }
    ];

    const products = await Product.find();

    const currentMonthProducts = products.filter(product => {
        const dateOfSale = new Date(product.dateOfSale);
        return dateOfSale.getMonth() + 1 === parseInt(month);
    });

    currentMonthProducts.forEach(product => {
        const price = product.price;

        if (price >= 0 && price <= 100) {
            priceRanges[0].count++;
        } else if (price >= 101 && price <= 200) {
            priceRanges[1].count++;
        } else if (price >= 201 && price <= 300) {
            priceRanges[2].count++;
        } else if (price >= 301 && price <= 400) {
            priceRanges[3].count++;
        } else if (price >= 401 && price <= 500) {
            priceRanges[4].count++;
        } else if (price >= 501 && price <= 600) {
            priceRanges[5].count++;
        } else if (price >= 601 && price <= 700) {
            priceRanges[6].count++;
        } else if (price >= 701 && price <= 800) {
            priceRanges[7].count++;
        } else if (price >= 801 && price <= 900) {
            priceRanges[8].count++;
        } else {
            priceRanges[9].count++;
        }
    });

    return res.status(200).json(
        new ApiResponse(200, priceRanges, "Bar Chart Data Fetched Successfully")
    );
});

const getCombinedResponse = asyncHandler(async (req, res) => {
    const { month } = req.params;

    const priceRange = await axios.get(`http://localhost:8000/api/v1/product/priceRange/${month}`)
    const statistics = await axios.get(`http://localhost:8000/api/v1/product/statistics/${month}`)
    const uniqueCategories = await axios.get(`http://localhost:8000/api/v1/product/uniqueCategories/${month}`)

    if(!statistics || !uniqueCategories) throw new ApiError(404,"Data NOT Fetched Successfully");
    
    const combinedResponse = {
        priceRange: priceRange.data.data,
        statistics: statistics.data.data,
        uniqueCategories: uniqueCategories.data.data
    };
    res.status(200).json(
        new ApiResponse(200, combinedResponse, "Combined Data Fetched")
    );
})

export {
    postSeededData,
    getAllTransactions,
    getStatistics,
    getUniqueCategories,
    getMonthlyPriceRange,
    getCombinedResponse
}