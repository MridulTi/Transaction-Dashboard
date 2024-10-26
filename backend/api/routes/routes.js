import { Router } from "express";
import { getAllTransactions, getCombinedResponse, getMonthlyPriceRange, getStatistics, getUniqueCategories, postSeededData } from "../controllers/product.controller.js";


const router=Router()

// product routes
router.route("/seed_data/").get(postSeededData);
router.route("/all_transactions/:month").get(getAllTransactions);
router.route("/statistics/:month").get(getStatistics);
router.route("/priceRange/:month").get(getMonthlyPriceRange);
router.route("/uniqueCategories/:month").get(getUniqueCategories);
router.route("/combinedResponse/:month").get(getCombinedResponse);

export default router